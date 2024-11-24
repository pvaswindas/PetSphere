from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, LoginSerializer
from .serializers import PetSphereUserSerializer
from .models import PetSphereUser
from .opt_utils import generate_otp, resend_otp, verify_otp
from .tasks import send_otp_email, forgot_password_otp


class SendOTPView(APIView):
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


class ResendOTPView(APIView):
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


class VerifyOTPView(APIView):
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


class ForgotPassword(APIView):
    def post(self, request):
        is_username = request.data.get('is_username')

        if is_username:
            username = request.data.get('username')
            try:
                user = PetSphereUser.objects.get(username=username)
                if user:
                    email = user.email
                    otp = generate_otp(email)
                    forgot_password_otp(email, otp)
            except PetSphereUser.DoesNotExist:
                return Response({"error": "User not found"},
                                status=status.HTTP_404_NOT_FOUND)
