from django.urls import path
from .views import get_conversations

urlpatterns = [
    path('conversations/', get_conversations, name='conversations')
]
