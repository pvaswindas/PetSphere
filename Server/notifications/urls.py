from django.urls import path
from .views import initiate_call, send_notification

urlpatterns = [
    path('initiate-call/', initiate_call, name='initiate-call'),
    path('send-notification/', send_notification, name='send-notification'),
]
