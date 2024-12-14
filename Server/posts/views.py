from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Post
from .serializers import PostSerializer, PostImageSerializer


class UserPostListCreateView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        user = request.user
        posts = Post.objects.filter(user=user)
        if not posts:
            return Response({"detail": "No posts found"},
                            status=status.HTTP_204_NO_CONTENT)
        serializer = PostSerializer(posts, many=True,
                                    context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        user = request.user
        data = request.data
        data['user'] = user.id
        images = request.FILES.getlist('images')
        serializer = PostSerializer(data=data,
                                    context={'request': request})
        if serializer.is_valid():
            post = serializer.save()
            if images:
                image_data = [{'post': post.id, 'image': image}
                              for image in images]
                image_serializer = PostImageSerializer(data=image_data,
                                                       many=True,
                                                       context={
                                                           'request': request})
                if image_serializer.is_valid():
                    image_serializer.save()
                else:
                    return Response(image_serializer.errors,
                                    status=status.HTTP_400_BAD_REQUEST)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserPostDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, slug):
        try:
            post = Post.objects.get(slug=slug)
        except Post.DoesNotExist:
            return Response({"detail": "Post not found"},
                            status=status.HTTP_404_NOT_FOUND)

        serializer = PostSerializer(post, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, slug):
        try:
            post = Post.objects.get(slug=slug)
        except Post.DoesNotExist:
            return Response({"detail": "Post not found"},
                            status=status.HTTP_404_NOT_FOUND)

        data = request.data.copy()
        data.pop('slug', None)

        serializer = PostSerializer(
            post, data=data, partial=True, context={'request': request}
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, slug):
        try:
            post = Post.objects.get(slug=slug)
        except Post.DoesNotExist:
            return Response({"detail": "Post not found"},
                            status=status.HTTP_404_NOT_FOUND)
        if post.user != request.user:
            return Response({"detail": "Permission denied"},
                            status=status.HTTP_403_FORBIDDEN)
        post.delete()
        return Response({'detail': 'Post Deleted Successfully'},
                        status=status.HTTP_204_NO_CONTENT)
