from django.urls import path
from .views import (
    ProfileView, PeopleListView, AccountListView, AccountDetailView
)

urlpatterns = [
    path('profile/', ProfileView.as_view(), name='profile'),
    path('filter/', AccountListView.as_view(), name='accounts-list'),
    path(
        'account/<int:user_id>/', AccountDetailView.as_view(),
        name='account-detail'
    ),
    path('people-list/', PeopleListView.as_view(), name='people-list')
]
