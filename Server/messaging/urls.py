from django.urls import path
from .views import get_conversations, get_messages

urlpatterns = [
    path('conversations/', get_conversations, name='conversations'),
    path('chat/<str:username>/', get_messages, name='chat')
]
