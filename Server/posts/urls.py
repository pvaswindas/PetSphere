from django.urls import path
from .views import (
     UserPostListCreateView, UserPostDetailView,
     PetListingDataStoreView, PetListingsView
)

urlpatterns = [
     path('', UserPostListCreateView.as_view(), name='user-post-list-create'),
     path('listingdatastore/', PetListingDataStoreView.as_view(),
          name='pet-listing-data-store'),
     path('petlisting/', PetListingsView.as_view(), name='pet-listing'),
     path('<str:slug>/', UserPostDetailView.as_view(),
          name='user-post-detail'),
]
