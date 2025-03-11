import redis
import json
from datetime import datetime, timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from google.oauth2 import id_token
from google.auth.transport import requests
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import update_last_login
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from .serializers import RegisterSerializer, LoginSerializer
from .serializers import PetSphereUserSerializer, UserDataStoreSerializer
from .serializers import ChangePasswordSerializer, ResetPasswordSerializer
from user_profile.serializers import ProfileSerializer
from .models import PetSphereUser, AccountSettings
from user_profile.models import Profile
from .utils.otp_utils import generate_otp, resend_otp, verify_otp
from .tasks import send_otp_email, send_reset_email
from petsphere.utils.common_utils import (
    validate_authenticated_user, generate_random_otp
)
from .tasks import twilio_send_otp
from google.auth.exceptions import GoogleAuthError

redis_client = redis.StrictRedis(host='redis', port=6379, db=0,
                                 decode_responses=True)


# ------------------------------ OTP Management ------------------------------
class SendOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({"error": "Email is required"},
                            status=status.HTTP_400_BAD_REQUEST)
        otp, expiry_minutes = generate_otp(email)
        if otp:
            send_otp_email.delay(email, otp, expiry_minutes)
            return Response({"message": "OTP sent successfully"},
                            status=status.HTTP_200_OK)
        return Response({"error": "Failed to send otp, please try again"},
                        status=status.HTTP_400_BAD_REQUEST)


class ResendOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({"error": "Email is required"},
                            status=status.HTTP_400_BAD_REQUEST)
        try:
            otp_entry, message = resend_otp(email)
            if otp_entry:
                otp = otp_entry.get("otp")
                expiry_minutes = otp_entry.get("expiry_minutes")
                send_otp_email.delay(email, otp, expiry_minutes)
                return Response({"message": "OTP resent successfully"},
                                status=status.HTTP_200_OK)
            else:
                return Response({"error": message},
                                status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')
        if not email or not otp:
            return Response({"error": "Email and OTP are required"},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            is_valid, message = verify_otp(email, otp)
            if is_valid:
                return Response({"message": "OTP verified successfully"},
                                status=status.HTTP_200_OK)
            else:
                return Response({"error": message},
                                status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ---------------------------- User Authentication ----------------------------
class UserDataStoreView(APIView):
    def get_permissions(self):
        if self.request.method == 'POST':
            return [AllowAny()]
        elif self.request.method == 'GET':
            return [IsAuthenticated()]
        return super().get_permissions()

    def post(self, request):
        user_data = request.data.get('user_data')
        if not user_data:
            return Response({"error": "User Data is required"},
                            status=status.HTTP_400_BAD_REQUEST)
        email = request.data.get('email')
        if not email:
            return Response({"error": "Email is required"},
                            status=status.HTTP_400_BAD_REQUEST)
        try:
            serializer = UserDataStoreSerializer(data=user_data)
            if serializer.is_valid():
                redis_key = f"user_data:{email}"
                redis_client.set(redis_key, json.dumps(user_data))
                redis_client.expire(redis_key, 1200)
                return Response({"message": "User data stored successfully"},
                                status=status.HTTP_201_CREATED)
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, request):
        try:
            username = request.user.username
            if not username:
                return Response({"error": "Username is required"},
                                status=status.HTTP_400_BAD_REQUEST)
            redis_key = f"user_data:{username}"
            user_data = redis_client.get(redis_key)
            if not user_data:
                return Response({"error": "User Data not found"},
                                status=status.HTTP_404_NOT_FOUND)
            return Response({"user_data": user_data.decode('utf-8')},
                            status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def validateUser(request):
    username = request.data.get('username')
    if not username:
        return Response({"error": "Username is required"},
                        status=status.HTTP_400_BAD_REQUEST)
    try:
        user = PetSphereUser.objects.get(username)
        if user.is_staff:
            return Response({"user_type": "admin"},
                            status=status.HTTP_200_OK)
        return Response({"user_type": "user"},
                        status=status.HTTP_200_OK)
    except PetSphereUser.DoesNotExist:
        return Response({"error": "User not found"},
                        status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([AllowAny])
def check_username(request):
    username = request.data.get('username', '').strip()
    if not username:
        return Response({"error": "Username is required."},
                        status=status.HTTP_400_BAD_REQUEST)
    if not username.isalnum() and '_' not in username:
        return Response(
            {
                "error": (
                    "Username can only contain letters, numbers, "
                    "and underscores."
                )
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    if len(username) < 3 or len(username) > 15:
        return Response(
            {
                "error": "Username must be between 3 and 15 characters."
            },
            status=status.HTTP_400_BAD_REQUEST,
        )
    is_available = not PetSphereUser.objects.filter(
        username__iexact=username).exists()
    return Response({"available": is_available})


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            email = request.data.get('email')
            username = request.data.get('username')
            if not email:
                return Response({"error": "Email is required"},
                                status=status.HTTP_)

            redis_key = f"user_data:{email}"
            user_data = redis_client.get(redis_key)

            if not user_data:
                return Response({"error": "User Data not found"},
                                status=status.HTTP_404_NOT_FOUND)
            user_data = json.loads(user_data)
            user_data['username'] = username

            serializer = RegisterSerializer(data=user_data)
            if serializer.is_valid():
                user = serializer.save()
                profile = user.profile
                profile_data = ProfileSerializer(
                    profile,
                    context={'request': request}).data
                refresh = RefreshToken.for_user(user)
                update_last_login(None, user)
                redis_client.delete(redis_key)
                return Response({
                    "message": "User registered successfully",
                    "profile": profile_data,
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                }, status=status.HTTP_201_CREATED)

            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            profile = Profile.objects.get(user__id=user.id)
            settings = AccountSettings.objects.filter(user=user).first()

            # Check for pending, suspended, or deleted account status
            if user.is_pending:
                return Response(
                    {"error": "Your account is pending approval."},
                    status=status.HTTP_403_FORBIDDEN
                )

            if user.is_suspended:
                return Response(
                    {"error": "Your account has been suspended."},
                    status=status.HTTP_403_FORBIDDEN
                )

            if settings and settings.deleted_at is not None:
                return Response(
                    {"error": "Your account has been deactivated."},
                    status=status.HTTP_403_FORBIDDEN
                )

            profile_data = ProfileSerializer(
                profile,
                context={'request': request}).data

            # Generate authentication tokens
            refresh = RefreshToken.for_user(user)

            # Update login time
            update_last_login(None, user)
            return Response({
                "profile": profile_data,
                "refresh": str(refresh),
                "access": str(refresh.access_token)
            }, status=status.HTTP_200_OK)
        return Response({"error": "Invalid Credentials"},
                        status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            email = request.data["email"]
            if not refresh_token:
                return Response({"error": "Refresh token is required"},
                                status=status.HTTP_400_BAD_REQUEST)
            token = RefreshToken(refresh_token)
            token.blacklist()
            redis_key = f"user_data:{email}"
            redis_client.delete(redis_key)
            return Response({"message": "Successfully logged out"},
                            status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ---------------------------- Password Management ----------------------------
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data, context={'request': request}
            )

        if serializer.is_valid():
            serializer.save()
            return Response({'success': 'Password changed successfully'},
                            status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def find_your_account(request):
    try:
        key = list(request.data.keys())[0]
        parsed_data = json.loads(key)
        email_data = parsed_data.get('email')
        username_data = parsed_data.get('username')

        if not email_data and not username_data:
            return Response({"error": "User not found"},
                            status=status.HTTP_404_NOT_FOUND)

        if email_data:
            user = PetSphereUser.objects.get(email=email_data)
        elif username_data:
            user = PetSphereUser.objects.get(username=username_data)

        email_response = send_reset_email(user)
        return Response(
            {
                "message": "Email sent successfully",
                "reset_password_url": email_response,
            },
            status=status.HTTP_200_OK
        )
    except PetSphereUser.DoesNotExist:
        return Response({"error": "User not found"},
                        status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        uid = request.data.get('uid')
        token = request.data.get('token')
        new_password = request.data.get('new_password')

        try:
            user = PetSphereUser.objects.get(pk=uid)
        except PetSphereUser.DoesNotExist:
            return Response({"error": "Invalid user ID"},
                            status=status.HTTP_400_BAD_REQUEST)

        token_generator = PasswordResetTokenGenerator()
        if not token_generator.check_token(user, token):
            return Response({'error': 'Invalid or expired token'},
                            status=status.HTTP_408_REQUEST_TIMEOUT)
        serializer = ResetPasswordSerializer(
            data={'new_password': new_password}
            )
        if serializer.is_valid():
            serializer.save(user=user)
            return Response({'success': 'Password reset successfull'},
                            status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)


# -------------------------- User Profile & Settings --------------------------
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = PetSphereUserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request):
        user = request.user
        serializer = PetSphereUserSerializer(
            user, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            profile = user.profile
            profile_serializer = ProfileSerializer(
                profile, data=request.data, partial=True,
                context={'request': request}
            )
            if profile_serializer.is_valid():
                profile_serializer.save()
                return Response(profile_serializer.data,
                                status=status.HTTP_200_OK)
            return Response(profile_serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_phone_number(request):
    try:
        user = validate_authenticated_user(request)
        if isinstance(user, Response):
            return user

        countryCode = request.data.get('countryCode', '').strip()
        mobileNumber = request.data.get('mobileNumber', '').strip()
        phone_number = f"{countryCode}{mobileNumber}"

        if not phone_number:
            return Response(
                {"error": "Phone Number is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        username = user.username
        redis_key = f"{username}-{phone_number}"

        try:
            created_ealier = redis_client.hgetall(redis_key)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        if created_ealier:
            resend_count = int(created_ealier.get('resend_count', 1))
            if resend_count >= 2:
                return Response(
                    {"error": "You have already requested OTP 2 times."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            else:
                redis_client.hincrby(redis_key, 'resend_count', 1)
                otp = created_ealier.get('otp')
        else:
            otp = generate_random_otp()
            expire_time = datetime.now() + timedelta(minutes=10)
            expire_time_str = expire_time.isoformat()

            try:
                redis_client.hmset(redis_key, {
                    'expires_in': expire_time_str,
                    'otp': otp,
                    'created_at': datetime.now().isoformat(),
                    'resend_count': 1
                })
                redis_client.expire(redis_key, 600)
            except Exception as e:
                return Response(
                    {"error": str(e)},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        try:
            twilio_send_otp(phone_number, otp)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response(
            {"success": "OTP has been sent to registered phone number."},
            status=status.HTTP_200_OK
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_mobile_otp(request):
    try:
        user = validate_authenticated_user(request)
        if isinstance(user, Response):
            return user
        countryCode = request.data.get('countryCode', '').strip()
        mobileNumber = request.data.get('mobileNumber', '').strip()
        phone_number = f"{countryCode}{mobileNumber}"
        otp = request.data.get('otp').strip()
        username = user.username
        redis_key = f"{username}-{phone_number}"
        created_ealier = redis_client.hgetall(redis_key)
        if not created_ealier:
            return Response(
                {"error": "OTP has expired or not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        if created_ealier['otp'] == otp:
            user.mobile_no = phone_number
            user.save()
            redis_client.delete(redis_key)
            profile = user.profile
            profile_serializer = ProfileSerializer(
                profile, partial=True,
                context={'request': request}
            )
            return Response(
                {
                    "success": "OTP has been verified successfully.",
                    "profile": profile_serializer.data
                },
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"error": "Invalid OTP."},
                status=status.HTTP_400_BAD_REQUEST
            )
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# ----------------------- Security & Account Management -----------------------
class DeactivateAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        user = request.user

        user.is_active = False
        user.save()
        return Response({'success': 'Account deactivated successfully'},
                        status=status.HTTP_200_OK)


class ReactivateAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        user = request.user

        user.is_active = True
        user.save()
        return Response({'success': 'Account reactivated successfully'})


@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def suspend_account(request, user_id):
    try:
        user = PetSphereUser.objects.get(pk=user_id)
        user.is_suspended = True
        user.is_active = False
        user.save()
        return Response({'success': 'Account suspended successfully'})
    except PetSphereUser.DoesNotExist:
        return Response(
            {'error': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def reinstate_account(request, user_id):
    try:
        user = PetSphereUser.objects.get(pk=user_id)
        user.is_suspended = False
        user.is_active = True
        user.save()
        return Response({'success': 'Account reinstate successfully'})
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# ----------------------- Google Authentication -----------------------
class GoogleLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get('token')
        if not token:
            return Response({'error': 'Token is required'},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            google_client_id = settings.SOCIAL_AUTH_GOOGLE_OAUTH2_KEY

            try:
                idinfo = id_token.verify_oauth2_token(
                    token, requests.Request(), google_client_id
                )
            except GoogleAuthError as e:
                return Response(
                    {
                        'error': 'Google authentication failed',
                        'details': str(e)
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            email = idinfo.get('email')
            name = idinfo.get('name', '')

            if not email:
                return Response(
                    {"error": "Invalid token, email not found"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Generate a unique username before creating the user
            base_username = email.split("@")[0]
            username = base_username
            counter = 1
            while PetSphereUser.objects.filter(username=username).exists():
                username = f"{base_username}_{counter}"
                counter += 1

            user, created = PetSphereUser.objects.get_or_create(
                email=email,
                defaults={"name": name, "username": username},
            )

            profile, _ = Profile.objects.get_or_create(user=user)
            account_settings = AccountSettings.objects.filter(
                user=user
            ).first()

            # Check for pending, suspended, or deleted account status
            if user.is_pending:
                return Response(
                    {"error": "Your account is pending approval."},
                    status=status.HTTP_403_FORBIDDEN
                )

            if user.is_suspended:
                return Response(
                    {"error": "Your account has been suspended."},
                    status=status.HTTP_403_FORBIDDEN
                )

            if account_settings and account_settings.deleted_at is not None:
                return Response(
                    {"error": "Your account has been deactivated."},
                    status=status.HTTP_403_FORBIDDEN
                )

            profile_data = ProfileSerializer(
                profile, context={'request': request}
            ).data

            refresh = RefreshToken.for_user(user)
            update_last_login(None, user)

            status_code = (
                status.HTTP_201_CREATED if created else status.HTTP_200_OK
            )
            return Response(
                {
                    'profile': profile_data,
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'email': str(email),
                },
                status=status_code
            )

        except Exception as e:
            return Response(
                {"error": "Unexpected error", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# ------------------------------ Admin Insights ------------------------------
@api_view(['GET'])
@permission_classes([IsAdminUser])
def active_users(request):
    today = datetime.now()
    first_day_of_this_month = today.replace(day=1)
    first_day_of_last_month = (
        first_day_of_this_month - timedelta(days=1)
    ).replace(day=1)

    active_users = PetSphereUser.objects.filter(
        is_active=True, is_staff=False
    ).count()

    users_this_month = PetSphereUser.objects.filter(
        is_staff=False,
        date_joined__gte=first_day_of_this_month
    ).count()

    users_last_month = PetSphereUser.objects.filter(
        is_staff=False,
        date_joined__gte=first_day_of_last_month,
        date_joined__lt=first_day_of_this_month
    ).count()

    data = {
        "active_users": active_users,
        "users_this_month": users_this_month,
        "users_last_month": users_last_month,
    }

    return Response(data)
