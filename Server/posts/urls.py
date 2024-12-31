from django.urls import path
from .views import (
     UserPostListCreateView, UserPostDetailView,
     PetListingDataStoreView, PetListingsView,
     like_post, fetch_liked_users
)

urlpatterns = [
     path('', UserPostListCreateView.as_view(), name='user-post-list-create'),
     path('listingdatastore/', PetListingDataStoreView.as_view(),
          name='pet-listing-data-store'),
     path('petlisting/', PetListingsView.as_view(), name='pet-listing'),
     path('likepost/', like_post, name='like-post'),
     path('likedusers/<int:post_id>/', fetch_liked_users,
          name='fetch_liked_users'),
     path('<str:slug>/', UserPostDetailView.as_view(),
          name='user-post-detail'),
]
