from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, LoginView, SendOTPView, ResendOTPView, VerifyOTPView,
    ForgotPassword, ResetPassword, ChangePasswordView, UserDataStoreView,
    UserProfileViews, DeactivateAccountView, ReactivateAccountView,
    check_username,
)

urlpatterns = [
    # -------------------------- User Authentication --------------------------
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # ---------------------------- OTP Management -----------------------------
    path('sendotp/', SendOTPView.as_view(), name='sendotp'),
    path('resendotp/', ResendOTPView.as_view(), name='resendotp'),
    path('verifyotp/', VerifyOTPView.as_view(), name='verifyotp'),

    # -------------------------- Username Management --------------------------
    path('check-username/', check_username, name='check-username'),

    # ------------------------ User Profile & Settings ------------------------
    path('user-data-store/', UserDataStoreView.as_view(),
         name='userdatastore'),
    path('user-profile/', UserProfileViews.as_view(), name='userprofile'),

    # -------------------------- Password Management --------------------------
    path('forgot-password/', ForgotPassword.as_view(), name='forgotpassword'),
    path('reset-password/', ResetPassword.as_view(), name='resetpassword'),
    path('change-password/', ChangePasswordView.as_view(),
         name='changepassword'),

    # --------------------- Security & Account Management ---------------------
    path('deactivate-account/', DeactivateAccountView.as_view(),
         name='deactivateaccount'),
    path('reactivate-account/', ReactivateAccountView.as_view(),
         name='reactivateaccount'),
]
