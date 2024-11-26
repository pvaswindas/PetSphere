from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, LoginSerializer
from .serializers import PetSphereUserSerializer
from .serializers import ChangePasswordSerializer, ResetPasswordSerializer
from .models import PetSphereUser
from .utils.otp_utils import generate_otp, resend_otp, verify_otp
from .tasks import send_otp_email, send_password_otp_email


# View to handle sending OTP for email verification
class SendOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({"error": "Email is required"},
                            status=status.HTTP_400_BAD_REQUEST)

        otp_entry = generate_otp(email)
        if otp_entry:
            send_otp_email.delay(email, otp_entry.otp)
            return Response({"message": "OTP sent successfully"},
                            status=status.HTTP_200_OK)
        return Response({"error": "Failed to send otp, please try again"},
                        status=status.HTTP_400_BAD_REQUEST)


# View to handle resending OTP if the user requests it
class ResendOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({"error": "Email is required"},
                            status=status.HTTP_400_BAD_REQUEST)
        try:
            otp_entry = resend_otp(email)
            if otp_entry:
                send_otp_email.delay(email, otp_entry.otp)
                return Response({"message": "OTP resent successfully"},
                                status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)},
                            status=status.HTTP_400_BAD_REQUEST)


# View to verify the OTP provided by the user
class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')
        if not email or not otp:
            return Response({"error": "Email and OTP are required"},
                            status=status.HTTP_400_BAD_REQUEST)
        try:
            otp_entry = verify_otp(email, otp)
            if otp_entry:
                return Response({"message": "OTP verified successfully"},
                                status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)},
                            status=status.HTTP_400_BAD_REQUEST)


# View to handle user registration, including JWT token generation
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


# View to handle user login, including JWT token generation
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


# View to handle forgot password requests and initiate OTP generation
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


# View to handle resetting the user's password based on a valid token
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

        from django.contrib.auth.tokens import PasswordResetTokenGenerator
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
