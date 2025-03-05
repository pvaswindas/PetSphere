# Standard libraries
from django.shortcuts import get_object_or_404

# Third-party libraries
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes

# Internal modules
from .models import (
    Like, Comment, Follower, CommentLike
)
from user_profile.models import Profile
from user_profile.serializers import ProfileSerializer
from .serializers import (
    CommentSerializer
)
from petsphere.utils.common_utils import (
    validate_post_user_permission, validate_request_data,
    validate_authenticated_user
)
from posts.models import Post
from accounts.models import PetSphereUser
from .utils.mutual_friends import get_mutual_friends


# ------------------------------ Follow System ------------------------------

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def follow_user(request, user_id):
    try:
        follower = validate_authenticated_user(request)
        if isinstance(follower, Response):
            return follower
        following = get_object_or_404(PetSphereUser, pk=user_id)

        if follower == following:
            return Response(
                {"error": "Follower and Following can't be same"},
                status=status.HTTP_400_BAD_REQUEST
            )
        Follower.objects.get_or_create(follower=follower, following=following)
        return Response(
            {
                "success": "Followed Successfully",
            },
            status=status.HTTP_201_CREATED
        )
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def unfollow_user(request, user_id):
    try:
        follower = validate_authenticated_user(request)
        if isinstance(follower, Response):
            return follower
        following = get_object_or_404(PetSphereUser, pk=user_id)

        Follower.objects.filter(
            follower=follower, following=following
        ).delete()
        return Response(
            {
                "success": "Unfollowed Successfully",
            },
            status=status.HTTP_200_OK
        )
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def mutual_friends(request, user_id):
    user = validate_authenticated_user(request)
    if isinstance(user, Response):
        return user
    other_user = get_object_or_404(PetSphereUser, user_id)
    mutual_friends = get_mutual_friends(user, other_user)

    return Response(
        {"mutual_friends": mutual_friends},
        status=status.HTTP_200_OK
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_followers(request):
    try:
        username = request.query_params.get("username")
        if (username):
            user = get_object_or_404(PetSphereUser, username=username)
        else:
            user = validate_authenticated_user(request)
            if isinstance(user, Response):
                return user
        followers = Follower.objects.filter(following=user)
        follower_profiles = Profile.objects.filter(
            user__in=[user.follower for user in followers]
        )
        serializer = ProfileSerializer(
            follower_profiles,
            many=True,
            context={
                'request': request,
                'optional_fields': ['user', 'profile_picture']
            }
        )
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_followings(request):
    try:
        username = request.query_params.get("username")
        if (username):
            user = get_object_or_404(PetSphereUser, username=username)
        else:
            user = validate_authenticated_user(request)
            if isinstance(user, Response):
                return user
        followings = Follower.objects.filter(follower=user)
        followings_profiles = Profile.objects.filter(
            user__in=[follow.following for follow in followings]
        )
        serializer = ProfileSerializer(
            followings_profiles,
            many=True,
            context={
                'request': request,
                'optional_fields': ['user', 'profile_picture']
            }
        )
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# -------------------------------- Like System --------------------------------

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_post(request):
    try:
        user = validate_authenticated_user(request)
        if isinstance(user, Response):
            return user

        required_fields = ['post_id']
        data = validate_request_data(request, required_fields)
        if isinstance(data, Response):
            return data
        post_id = data['post_id']
        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response({"error": "Post not found"},
                            status=status.HTTP_404_NOT_FOUND)

        like = Like.objects.filter(user=user, post=post)
        if like.exists():
            like.delete()
            like_count = post.like.count()
            post.like_count = like_count
            post.save()
            return Response({'detail': 'Post Unliked Successfully'},
                            status=status.HTTP_200_OK)
        else:
            Like.objects.create(user=user, post=post)
            like_count = post.like.count()
            post.like_count = like_count
            post.save()
            return Response({'detail': 'Post Liked Successfully'},
                            status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def fetch_liked_users(request, post_id):
    try:
        user = validate_authenticated_user(request)
        if isinstance(user, Response):
            return user
        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response({"error": "Post not found"},
                            status=status.HTTP_404_NOT_FOUND)

        liked_users = Like.objects.filter(post=post).select_related('user') \
            .order_by('-created_at').values_list('user__username', flat=True)

        is_liked_by_user = user.username in liked_users
        return Response(
            {'liked_users': list(liked_users),
             'is_liked_by_user': is_liked_by_user},
            status=status.HTTP_200_OK
        )
    except Exception as e:
        return Response({"error": str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ------------------------------ Comment System ------------------------------

class CommentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user = validate_authenticated_user(request)
            if isinstance(user, Response):
                return user
            required_fields = ['content', 'post', 'parent']
            data = validate_request_data(request, required_fields)
            data['user'] = user.id
            if isinstance(user, Response):
                return data
            post_id = data['post']
            try:
                post = Post.objects.get(id=post_id)
            except Post.DoesNotExist:
                return Response({"error": "Post not found"},
                                status=status.HTTP_400_BAD_REQUEST)
            serializer = CommentSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                comments_count = post.comment.count()
                post.comment_count = comments_count
                post.save()
                return Response({"success": serializer.data},
                                status=status.HTTP_201_CREATED)
            else:
                return Response({"error": serializer.errors},
                                status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, comment_id):
        try:
            user = validate_authenticated_user(request)
            if isinstance(user, Response):
                return user

            try:
                comment = Comment.objects.get(id=comment_id)
            except Comment.DoesNotExist:
                return Response({"error": "Comment not found"},
                                status=status.HTTP_404_NOT_FOUND)

            post = comment.post

            permission_response = validate_post_user_permission(
                user, comment, post
            )
            if permission_response:
                return permission_response

            comment.delete()
            comments_count = post.comment.count()
            post.comment_count = comments_count
            post.save()

            return Response({"success": "Comment deleted successfully"},
                            status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ListCommentsForPostView(ListAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        post_id = self.kwargs['post_id']
        get_object_or_404(Post, id=post_id)
        return Comment.objects.filter(
            post__id=post_id, parent=None
        ).order_by('-created_at')


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def like_comment(request, comment_id):
    try:
        user = validate_authenticated_user(request)
        if isinstance(user, Response):
            return user
        comment = Comment.objects.get(pk=comment_id)
        like_comment = CommentLike.objects.filter(
            user=user, comment=comment
        ).first()
        if like_comment:
            like_comment.delete()
            return Response(
                {"success": "Comment disliked successfully"},
                status=status.HTTP_200_OK
            )
        CommentLike.objects.create(user=user, comment=comment)
        return Response(
            {"success": "Comment liked successfully"}
        )
    except Comment.DoesNotExist:
        return Response(
            {"error": "Comment Doesn't exist"},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def fetch_comment_liked_users(request, comment_id):
    try:
        user = validate_authenticated_user(request)
        if isinstance(user, Response):
            return user
        comment = Comment.objects.get(pk=comment_id)
        comment_liked_users = CommentLike.objects.filter(
            comment=comment).select_related('user') \
            .order_by('-created_at').values_list('user__username', flat=True)

        is_liked_by_user = user.username in comment_liked_users
        return Response(
            {'comment_liked_users': list(comment_liked_users),
             'is_liked_by_user': is_liked_by_user},
            status=status.HTTP_200_OK
        )
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
