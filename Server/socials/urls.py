from django.urls import path
from .views import (
     follow_user, unfollow_user, mutual_friends,
     like_post, fetch_liked_users,
     CommentView, ListCommentsForPostView, like_comment
)


urlpatterns = [
     path('follow-user/<int:user_id>', follow_user, name='follow-user'),
     path('unfollow-user/<int:user_id>', unfollow_user, name='unfollow-user'),
     path(
          'mutual-friends/<int:user_id>', mutual_friends,
          name='mutual-friends'
     ),
     path('follow-user/<int:user_id>', follow_user),
     path('likepost/', like_post, name='like-post'),
     path(
          'likedusers/<int:post_id>/', fetch_liked_users,
          name='fetch_liked_users'
     ),
     path(
          'comments/create/', CommentView.as_view(), name='create-comment'
     ),
     path('comments/delete/<int:comment_id>/', CommentView.as_view(),
          name='delete-comment'),
     path(
          'comments/post/<int:post_id>/', ListCommentsForPostView.as_view(),
          name='list-comments'
     ),
     path(
          "comments/like/<int:comment_id>/", like_comment, name="like-comment"
     ),
]
