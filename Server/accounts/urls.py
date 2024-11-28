from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, LoginView
from .views import SendOTPView, ResendOTPView, VerifyOTPView
from .views import ForgotPassword, ResetPassword, ChangePasswordView
from .views import UserProfileViews
from .views import DeactivateAccountView, ReactivateAccountView


urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('sendotp/', SendOTPView.as_view(), name='sendotp'),
    path('resendotp/', ResendOTPView.as_view(), name='resendotp'),
    path('verifyotp/', VerifyOTPView.as_view(), name='verifyotp'),
    path('forgot-password/', ForgotPassword.as_view(), name='forgotpassword'),
    path('reset-password/', ResetPassword.as_view(), name='resetpassword'),
    path('change-password/', ChangePasswordView.as_view(),
         name='changepassword'),
    path('user-profile/', UserProfileViews.as_view(), name='userprofile'),
    path('deactivate-account/', DeactivateAccountView.as_view(),
         name='deactivateaccount'),
    path('reactivate-account/', ReactivateAccountView.as_view(),
         name='reactivateaccount'),
]
