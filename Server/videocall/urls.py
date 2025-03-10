from django.urls import path
from .views import accept_call, reject_call, get_turn_credentials

urlpatterns = [
    path('accept-call/', accept_call, name='accept-call'),
    path('reject-call/', reject_call, name='reject-call'),
    path(
        'get-turn-credentials/',
        get_turn_credentials,
        name='get-turn-credentials'
    ),
]
