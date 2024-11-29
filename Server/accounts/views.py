import redis
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from .serializers import RegisterSerializer, LoginSerializer
from .serializers import PetSphereUserSerializer
from .serializers import ChangePasswordSerializer, ResetPasswordSerializer
from .models import PetSphereUser
from .utils.otp_utils import generate_otp, resend_otp, verify_otp
from .tasks import send_otp_email, send_password_otp_email

redis_client = redis.StrictRedis(host='localhost', port=6379, db=0,
                                 decode_responses=True)


# ------------------------------ OTP Management ------------------------------
class SendOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        username = request.data.get('username')
        username = username.capitalize()
        if not email:
            return Response({"error": "Email is required"},
                            status=status.HTTP_400_BAD_REQUEST)

        otp, expiry_minutes = generate_otp(email)
        if otp:
            send_otp_email.delay(email, otp, username, expiry_minutes)
            return Response({"message": "OTP sent successfully"},
                            status=status.HTTP_200_OK)
        return Response({"error": "Failed to send otp, please try again"},
                        status=status.HTTP_400_BAD_REQUEST)


class ResendOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        username = request.data.get('username')
        username = username.capitalize()
        if not email:
            return Response({"error": "Email is required"},
                            status=status.HTTP_400_BAD_REQUEST)
        try:
            otp_entry, message = resend_otp(email)
            if otp_entry:
                otp = otp_entry.get("otp")
                expiry_minutes = otp_entry.get("expiry_minutes")
                send_otp_email.delay(email, otp, username, expiry_minutes)
                return Response({"message": "OTP resent successfully"},
                                status=status.HTTP_200_OK)
            else:
                return Response({"error": message},
                                status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)},
                            status=status.HTTP_400_BAD_REQUEST)


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
                            status=status.HTTP_400_BAD_REQUEST)


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
        username = request.data.get('username')
        if not username:
            return Response({"error": "Username is required"},
                            status=status.HTTP_400_BAD_REQUEST)
        try:
            redis_key = f"user_data:{username}"
            redis_client.set(redis_key, user_data)
        except Exception as e:
            return Response({"error": str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, request):
        username = request.user.username
        redis_key = f"user_data:{username}"
        try:
            user_data = redis_client.get(redis_key)
            if not user_data:
                return Response({"error": "User Data not found"},
                                status=status.HTTP_404_NOT_FOUND)
            return Response({"user_data": user_data.decode('utf-8')},
                            status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user_data = PetSphereUserSerializer(user).data
            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "User registered successfully",
                "user": user_data,
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            refresh = RefreshToken.for_user(user)
            user_data = PetSphereUserSerializer(user).data
            return Response({
                "user": user_data,
                "refresh": str(refresh),
                "access": str(refresh.access_token)
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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


class ForgotPassword(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        is_username = request.data.get('is_username')

        if is_username:
            username = request.data.get('username')
            try:
                user = PetSphereUser.objects.get(username=username)
                if user:
                    email = user.email
                    otp = generate_otp(email)
                    send_password_otp_email(email, otp)
            except PetSphereUser.DoesNotExist:
                return Response({"error": "User not found"},
                                status=status.HTTP_404_NOT_FOUND)


class ResetPassword(APIView):
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
                            status=status.HTTP_400_BAD_REQUEST)
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
class UserProfileViews(APIView):
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
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
