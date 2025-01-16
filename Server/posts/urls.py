from django.urls import path
from .views import (
     UserPostListCreateView, UserPostDetailView,
     PetListingDataStoreView, PetListingsView,
     PostListView, PetListingListView,
     save_post, fetch_saved_by
)

urlpatterns = [
     # Post-related URLs
     path('posts-list/', PostListView.as_view(), name='post-list'),
     path('savepost/<int:post_id>/', save_post, name='save-post'),
     path('saved-users/<int:post_id>/', fetch_saved_by, name='saved-users'),

     # Pet Listings URLs
     path('petlistings-list/', PetListingListView.as_view(),
          name='petlistings-list'),
     path('listingdatastore/', PetListingDataStoreView.as_view(),
          name='pet-listing-data-store'),
     path('petlisting/', PetListingsView.as_view(), name='pet-listing'),

     # User-related URLs
     path('', UserPostListCreateView.as_view(), name='user-post-list-create'),
     path('<str:slug>/', UserPostDetailView.as_view(),
          name='user-post-detail'),
]
