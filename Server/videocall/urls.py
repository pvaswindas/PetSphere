from django.urls import path
from .views import accept_call, reject_call

urlpatterns = [
    path('accept-call/', accept_call, name='accept-call'),
    path('reject-call/', reject_call, name='reject-call'),
]
