from django.urls import path
from .views import (
     CommentView, ListCommentsForPostView,
     like_post, fetch_liked_users
)


urlpatterns = [
     path('likepost/', like_post, name='like-post'),
     path('likedusers/<int:post_id>/', fetch_liked_users,
          name='fetch_liked_users'),
     path('comments/create/', CommentView.as_view(), name='create-comment'),
     path('comments/delete/<int:comment_id>/', CommentView.as_view(),
          name='delete-comment'),
     path('comments/post/<int:post_id>/', ListCommentsForPostView.as_view(),
          name='list-comments'),
]
