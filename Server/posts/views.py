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

        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        user = request.user
        data = request.data
        data['user'] = user.id
        images = request.FILES.getlist('images')

        serializer = PostSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            if images:
                post = serializer.instance
                image_data = [{'post': post.id, 'image': image}
                              for image in images]
                image_serializer = PostImageSerializer(data=image_data,
                                                       many=True)
                if image_serializer.is_valid():
                    image_serializer.save()
                else:
                    return Response(image_serializer.errors,
                                    status=status.HTTP_400_BAD_REQUEST)

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserPostDetailView(APIView):
    permission_classes = [IsAuthenticated]
