from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
     RegisterView, LoginView, SendOTPView, ResendOTPView, VerifyOTPView,
     ResetPasswordView, ChangePasswordView, UserDataStoreView,
     UserProfileView, DeactivateAccountView, ReactivateAccountView,
     LogoutView, GoogleLoginView,
     check_username, verify_phone_number, verify_mobile_otp, find_your_account,
     suspend_account, reinstate_account, active_users, get_user_status
)

urlpatterns = [
     # ------------------------- User Authentication -------------------------
     path('register/', RegisterView.as_view(), name='register'),
     path('login/', LoginView.as_view(), name='login'),
     path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
     path('logout/', LogoutView.as_view(), name='logout'),

     # --------------------------- OTP Management ----------------------------
     path('sendotp/', SendOTPView.as_view(), name='sendotp'),
     path('resendotp/', ResendOTPView.as_view(), name='resendotp'),
     path('verifyotp/', VerifyOTPView.as_view(), name='verifyotp'),

     # ------------------------- Username Management -------------------------
     path('check-username/', check_username, name='check-username'),

     # ----------------------- User Profile & Settings -----------------------
     path('user-data-store/', UserDataStoreView.as_view(),
          name='userdatastore'),
     path('user-profile/', UserProfileView.as_view(), name='userprofile'),
     path('verify-phone-number/', verify_phone_number, name='verify-phone-no'),
     path('verify-mobile-otp/', verify_mobile_otp, name='verify-mobile-otp'),

     # ------------------------- Password Management -------------------------
     path('find-account/', find_your_account, name='find-account'),
     path('reset-password/', ResetPasswordView.as_view(),
          name='resetpassword'),
     path('change-password/', ChangePasswordView.as_view(),
          name='changepassword'),

     # -------------------- Security & Account Management --------------------
     path('deactivate-account/', DeactivateAccountView.as_view(),
          name='deactivateaccount'),
     path('reactivate-account/', ReactivateAccountView.as_view(),
          name='reactivateaccount'),
     path('suspend-account/<int:user_id>/', suspend_account,
          name='suspendaccount'),
     path('reinstate-account/<int:user_id>/', reinstate_account,
          name='reinstateaccount'),

     # -------------------- Google Authentication --------------------
     path('google-login/', GoogleLoginView.as_view(), name='google-login'),

     # ---------------------------- Admin Insights ----------------------------
     path('active-users/', active_users, name='active-users'),

     # --------------------------- Account Insights ---------------------------
     path('user/status/', get_user_status, name='user-status'),
]
