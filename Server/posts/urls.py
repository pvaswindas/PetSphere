from django.urls import path
from .views import UserPostListCreateView, UserPostDetailView

urlpatterns = [
     path('', UserPostListCreateView.as_view(), name='user-post-list-create'),
     path('<int:pk>/', UserPostDetailView.as_view(), name='user-post-detail'),
]
