from django.urls import path
from .views import (
    ProfileView, PeopleListView
)

urlpatterns = [
    path('profile/', ProfileView.as_view(), name='profile'),

    path('people-list/', PeopleListView.as_view(), name='people-list')
]
