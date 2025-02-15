from django.urls import path
from .views import (
     UserPostListCreateView, UserPostDetailView,
     PetListingDataStoreView, PetListingsView,
     PostListView, PetListingListView, UserFeedView, PetMarketplaceView,
     save_post, fetch_saved_by, post_engagement_metrics
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

     # Feed-related URLs
     path('user-feed/', UserFeedView.as_view(), name='user-feed'),
     path('marketplace/', PetMarketplaceView.as_view(), name='marketplace'),


     # Admin-related URLs
     path(
          'admin/metrics/engagement',
          post_engagement_metrics,
          name='post-engagement-metrics'
     ),

     # User-related URLs
     path('', UserPostListCreateView.as_view(), name='user-post-list-create'),
     path('<str:slug>/', UserPostDetailView.as_view(),
          name='user-post-detail'),
]
