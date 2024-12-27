import redis
import json
from datetime import datetime
from rest_framework import status
from cryptography.fernet import Fernet
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Post, PetListing
from .serializers import (
    PostSerializer, PostImageSerializer, PetListingSerializer
)


key = Fernet.generate_key()
cipher_suite = Fernet(key)

redis_client = redis.StrictRedis(host='localhost', port=6379, db=0,
                                 decode_responses=True)


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
    permission_classes = [AllowAny,]

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


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def listingdatastore(request):
    data = request.data
    if not data:
        return Response({"error": "Pet Listing data not found"},
                        status=status.HTTP_400_BAD_REQUEST)
    username = request.user.username
    if not username:
        return Response({"error": "Username is required"},
                        status=status.HTTP_400_BAD_REQUEST)
    try:
        serializer = PetListingSerializer(data=data)
        if serializer.is_valid():
            time_now = datetime.now()
            formatted_time = time_now.strftime("%H:%M:%S %d-%m-%Y")
            redis_key = (
                f"{formatted_time}"
                f"{data.pet_name}"
                f"{data.pet_type}"
                f"{data.post_type}"
            )
            encrypted_redis_key = cipher_suite.encrypt(redis_key.encode())
            redis_client.set(redis_key, json.dumps(data))
            redis_client.expire(redis_key, 1200)
            return Response(
                {"encrypted_redis_key": encrypted_redis_key.decode()},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PetListingDataStoreView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        try:
            username = request.user.username
            petlistingkey = request.query_params.get('petlistingkey')

            if not username or not petlistingkey:
                return Response(
                    {"detail": "Username and petlistingkey are required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            redis_key = f"{username}:{petlistingkey}"
            decrypted_redis_key = cipher_suite.decrypt(
                redis_key.encode()).decode()
            data = redis.get(decrypted_redis_key)
            if not data:
                return Response({"detail": "Data not found"},
                                status=status.HTTP_404_NOT_FOUND)
            return Response({"petListing": data.decode('utf-8')},
                            status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PetListingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        pet_listings = PetListing.objects.filter(seller__user=user)
        serializer = PetListingSerializer(pet_listings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
