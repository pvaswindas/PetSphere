from django.urls import path
from .views import (
     UserPostListCreateView, UserPostDetailView,
     PetListingDataStoreView, PetListingsView,
     CommentView, ListCommentsForPostView,
     PostListView, PetListingListView,
     like_post, fetch_liked_users
)

urlpatterns = [
     path('', UserPostListCreateView.as_view(), name='user-post-list-create'),
     path('posts-list/', PostListView.as_view(), name='post-list'),
     path('petlistings-list/', PetListingListView.as_view(),
          name='petlistings-list'),
     path('listingdatastore/', PetListingDataStoreView.as_view(),
          name='pet-listing-data-store'),
     path('petlisting/', PetListingsView.as_view(), name='pet-listing'),
     path('likepost/', like_post, name='like-post'),
     path('likedusers/<int:post_id>/', fetch_liked_users,
          name='fetch_liked_users'),
     path('comments/create/', CommentView.as_view(),
          name='create-comment'),
     path('comments/delete/<int:comment_id>/', CommentView.as_view(),
          name='delete-comment'),
     path('comments/post/<int:post_id>/', ListCommentsForPostView.as_view(),
          name='list-comments'),
     path('<str:slug>/', UserPostDetailView.as_view(),
          name='user-post-detail'),
]
