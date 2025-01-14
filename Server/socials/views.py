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
    Like, Comment
)
from .serializers import (
    CommentSerializer
)
from petsphere.utils.common_utils import (
    validate_post_user_permission, validate_request_data,
    validate_authenticated_user
)
from posts.models import Post


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
        print(str(e))
        return Response({"error": str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['get'])
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
                print(f"SERIALIZER ERROR : {serializer.errors}")
                return Response({"error": serializer.errors},
                                status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(str)
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
            print(str(e))
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
