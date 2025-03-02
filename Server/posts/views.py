# Standard libraries
import redis
import json
from environs import Env
from datetime import datetime
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.core.files.base import ContentFile

# Third-party libraries
from rest_framework import status
from cryptography.fernet import Fernet
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.decorators import api_view, permission_classes

# Internal modules
from .models import (
    Post, PetListing, PetListingImageTemp, PetListingImage,
    SavedPost,
)
from accounts.models import PetSphereUser
from socials.models import Like
from pets.models import Pet, PetBreed
from sellers.models import Seller
from .serializers import (
    PostSerializer, PostImageSerializer, PetListingCreateSerializer,
    PetListingRetrieveSerializer, AddPostSerializer,
    PetListingImageTempSerializer, PetListingLocationSerializer
)
from petsphere.utils.common_utils import (
    validate_authenticated_user, validate_request_data,
)


env = Env()

env.read_env()

encryption_key = env.str("ENCRYPTION_KEY")

cipher_suite = Fernet(encryption_key)

redis_client = redis.StrictRedis(
    host='redis', port=6379, db=0, decode_responses=True
)


class UserPostListCreateView(APIView):
    """
    Handles listing and creating user posts.
    Permissions:
        - Requires user to be authenticated.
    Parsers:
        - MultiPartParser
        - FormParser
    """

    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        """
        Retrieves a list of posts created by the authenticated user.

        Parameters:
            - request: The HTTP request object containing user information.
            - username (optional): fetches posts for the specified user.

        Returns:
            - Response: A list of posts if they exist.
            - Response: A 204 status if no posts are found.
        """
        username = request.query_params.get("username")

        if username:
            user = get_object_or_404(PetSphereUser, username=username)
        else:
            user = validate_authenticated_user(request)
            if isinstance(user, Response):
                return user
        posts = Post.objects.filter(user=user)
        if not posts:
            return Response({"detail": "No posts found"},
                            status=status.HTTP_204_NO_CONTENT)
        serializer = PostSerializer(posts, many=True,
                                    context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """
        Creates a new post for the authenticated user.

        Parameters:
            - request: The HTTP request object with post data and images.

        Required Fields:
            - content: Content/body of the post.
            - images: List of image files (optional).

        Returns:
            - Response: Created post data on success.
            - Response: Error details on failure.
        """
        user = validate_authenticated_user(request)
        if isinstance(user, Response):
            return user
        data = request.data
        data['user'] = user.id
        images = request.FILES.getlist('images')
        serializer = AddPostSerializer(data=data,
                                       context={'request': request})
        profile = user.profile
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
            profile.pawstory_count += 1
            profile.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PostListView(APIView):
    def get(self, request):
        search_query = request.query_params.get('search', None)

        if search_query:
            posts = Post.objects.filter(
                Q(content__icontains=search_query) | Q(
                    slug__icontains=search_query)
            )
        else:
            posts = Post.objects.all()

        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def save_post(request, post_id):
    try:
        user = validate_authenticated_user(request)
        if isinstance(user, Response):
            return user

        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response({"error": "Post not found"},
                            status=status.HTTP_404_NOT_FOUND)

        is_saved = SavedPost.objects.filter(user=user, post=post).first()

        if is_saved:
            is_saved.delete()
            return Response(
                {"message": "Post unsaved successfully"},
                status=status.HTTP_200_OK
            )

        SavedPost.objects.create(
            user=user,
            post=post
        )
        return Response(
            {"message": "Post saved successfully"},
            status=status.HTTP_201_CREATED
        )
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def fetch_saved_by(request, post_id):
    try:
        user = validate_authenticated_user(request)
        if isinstance(user, Response):
            return user
        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response({"error": "Post not found"},
                            status=status.HTTP_404_NOT_FOUND)

        saved_users = SavedPost.objects.filter(
            post=post).select_related('user') \
            .order_by('-created_at').values_list('user__username', flat=True)

        is_saved_by_user = user.username in saved_users
        return Response(
            {
                'saved_users': list(saved_users),
                'is_saved_by_user': is_saved_by_user
            },
            status=status.HTTP_200_OK
        )
    except Exception as e:
        return Response({"error": str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserPostDetailView(APIView):
    """
    Handles retrieving, updating, and deleting a post by slug.

    Permissions:
        - AllowAny: Any user can access the view (no authentication required).

    Methods:
        - GET: Retrieves the details of a specific post.
        - PATCH: Updates the details of a specific post.
        - DELETE: Deletes the specified post.
    """

    permission_classes = [AllowAny,]

    def get(self, request, slug):
        """
        Retrieves the details of a specific post.

        Parameters:
            - request: The HTTP request object.
            - slug (str): The unique slug for the post to retrieve.

        Workflow:
            1. Attempts to fetch the post object using the provided slug.
            2. If the post is found, serializes and returns the data.
            3. If the post does not exist, returns a 404 response.

        Returns:
            - Response: Post details if found (200 OK).
            - Response: Error message if post not found (404 Not Found).
        """
        try:
            post = Post.objects.get(slug=slug)
        except Post.DoesNotExist:
            return Response({"detail": "Post not found"},
                            status=status.HTTP_404_NOT_FOUND)

        serializer = PostSerializer(post, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, slug):
        """
        Updates the details of a specific post.

        Parameters:
            - request: The HTTP request object with the update data.
            - slug (str): The unique slug of the post to update.

        Workflow:
            1. Fetches the post by its slug.
            2. Removes the slug from the data to prevent modification.
            3. Serializes the data with the partial update option.
            4. If the data is valid, saves and returns the updated post.
            5. If the data is invalid, returns validation errors.

        Returns:
            - Response: Updated post data if successful (200 OK).
            - Response: Validation errors if update fails (400 Bad Request).
            - Response: Error message if post not found (404 Not Found).
        """
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
        """
        Deletes the specified post.

        Parameters:
            - request: The HTTP request object.
            - slug (str): The unique slug of the post to delete.

        Workflow:
            1. Attempts to fetch the post by slug.
            2. Checks if the current user owns the post.
            3. If authorized, deletes the post and returns a success message.
            4. If not authorized, returns a permission denied message.

        Returns:
            - Response: Success message if post is deleted (204 No Content).
            - Response: Forbidden if user is not the owner (403 Forbidden).
            - Response: Error message if post not found (404 Not Found).
        """
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


class PetListingDataStoreView(APIView):
    """
    Manages temporary storage of pet listing data and images using Redis.
    Permissions:
        - Requires user to be authenticated.
    Parsers:
        - MultiPartParser
        - FormParser
    """

    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        """
        Stores pet listing data temporarily in Redis.

        Parameters:
            - request: The HTTP request object with listing data and images.

        Required Fields:
            - post_type: Type of post (e.g., sale, adoption).
            - pet_name: Name of the pet.
            - pet_type: Type of the pet (e.g., Dog, Cat).
            - breed: Breed of the pet (e.g., Labrador, Persian).
            - description: Description of the pet listing.
            - gender: Gender of the pet (e.g., Male, Female).
            - age: Age of the pet.
            - price: Price of the pet listing.
            - images: List of image files (at least one is required).

        Workflow:
        1. Extract required data (e.g., `pet_name`, `pet_type`) from request.
        2. Check if required fields are present, return error if missing.
        3. Authenticate the user using `validate_authenticated_user` function.
        4. Validate if images are provided in the request.
        5. Generate unique Redis key by combining user, time, and pet details.
        6. Encrypt the Redis key using the cipher suite.
        7. Serialize and save each image to the temporary storage.
        8. Store listing data in Redis with expiration time.
        9. Return the encrypted Redis key as the response on success.

        Returns:
            - Response: Encrypted Redis key on success.
            - Response: Error details on failure.

        Exceptions:
            - KeyError: Missing required key in request data.
            - Exception: Any other unexpected error.
        """
        try:
            data = {key: value for key, value in request.data.items()}
            pet_name = request.data.get('pet_name')
            pet_type = request.data.get('pet_type')
            post_type = request.data.get('post_type')

            if not pet_name or not pet_type or not post_type:
                return Response({"error": "Data is missing"},
                                status=status.HTTP_400_BAD_REQUEST)
            user = validate_authenticated_user(request)
            if isinstance(user, Response):
                return user
            images = request.FILES.getlist('images')
            if not images:
                return Response({"error": "Images are required"},
                                status=status.HTTP_400_BAD_REQUEST)

            data.pop('images')
            time_now = datetime.now()
            formatted_time = time_now.strftime("%H:%M:%S %d-%m-%Y")
            redis_key = (
                f"{user.username}:"
                f"{formatted_time}"
                f"{pet_name}"
                f"{pet_type}"
                f"{post_type}"
            )
            encrypted_redis_key = cipher_suite.encrypt(
                redis_key.encode())
            for image in images:
                image_data = {
                    'redis_key': redis_key,
                    'image': image
                }
                image_serializer = PetListingImageTempSerializer(
                    data=image_data
                )
                if image_serializer.is_valid():
                    image_serializer.save()
                else:
                    return Response({"error": image_serializer.errors},
                                    status=status.HTTP_400_BAD_REQUEST)
            redis_client.set(redis_key, json.dumps(data))
            redis_client.expire(redis_key, 3600)
            return Response(
                {"encrypted_redis_key": encrypted_redis_key.decode()},
                status=status.HTTP_201_CREATED
            )
        except KeyError as e:
            return Response({"error": f"Missing required key: {str(e)}"},
                            status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, request):
        """
        Retrieves pet listing data temporarily stored in Redis.

        Parameters:
            - request: The HTTP request object with query parameters.

        Query Parameters:
            - petListingKey: Encrypted Redis key representing the pet listing
            data.

        Workflow:
            1. Extracts the `petListingKey` from query parameters.
            2. Decrypts the provided `petListingKey` using the cipher suite.
            3. Fetches the decrypted key's associated data from Redis.
            4. Returns the pet listing data if found.

        Returns:
            - Response: A dictionary containing the pet listing data if
            successful.
            - Response: A 404 status with an error message if the key is not
            found.
            - Response: A 500 status for unexpected errors.

        Exceptions:
            - KeyError: If the `petListingKey` is not provided in the query
            parameters.
            - Exception: For any unexpected error during the process.
        """
        try:
            petlistingkey = request.query_params.get('petListingKey')

            decrypted_redis_key = cipher_suite.decrypt(
                petlistingkey.encode()).decode()
            data = redis_client.get(decrypted_redis_key)
            if not data:
                return Response({"detail": "Data not found"},
                                status=status.HTTP_404_NOT_FOUND)
            data = json.loads(data)
            return Response({"petListing": data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PetListingsView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        username = request.query_params.get("username")

        if username:
            user = get_object_or_404(PetSphereUser, username=username)
        else:
            user = validate_authenticated_user(request)
        if isinstance(user, Response):
            return user
        pet_listings = PetListing.objects.filter(seller__user=user)
        if not pet_listings:
            return Response({"detail": "No data found"},
                            status=status.HTTP_204_NO_CONTENT)
        serializer = PetListingRetrieveSerializer(pet_listings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        try:
            user = validate_authenticated_user(request)
            if isinstance(user, Response):
                return user
            profile = user.profile
            required_fields = [
                'post_type', 'pet_name', 'pet_type', 'breed',
                'description', 'gender', 'age', 'price',
                'address', 'city', 'state', 'zip_code', 'latitude',
                'longitude'
            ]
            data = validate_request_data(request, required_fields)
            if isinstance(data, Response):
                return data
            data = dict(data)
            cleaned_data = {key: value[0] if isinstance(value, list) and len(
                value) == 1 else value for key, value in data.items()}
            data.update(cleaned_data)
            seller, created = Seller.objects.get_or_create(user=user)
            data['seller'] = seller.id
            petListingKey = data.pop('petListingKey')
            decrypted_redis_key = cipher_suite.decrypt(
                petListingKey.encode()).decode()
            images = PetListingImageTemp.objects.filter(
                redis_key=decrypted_redis_key
            )
            if not images.exists():
                return Response({"detail": "Data not found"},
                                status=status.HTTP_404_NOT_FOUND)
            location_data = {
                'address': data.pop('address'),
                'city': data.pop('city'),
                'state': data.pop('state'),
                'zip_code': data.pop('zip_code'),
                'latitude': round(float(data.pop('latitude')), 6),
                'longitude': round(float(data.pop('longitude')), 6),
            }
            data['pet_type'] = Pet.objects.get(name=data['pet_type']).id
            data['breed'] = PetBreed.objects.get(name=data['breed']).id
            petListingSerializer = PetListingCreateSerializer(data=data)
            if petListingSerializer.is_valid():
                pet_listing = petListingSerializer.save()

                location_data['pet_listing'] = pet_listing.id
                location_serializer = PetListingLocationSerializer(
                    data=location_data)
                if location_serializer.is_valid():
                    location_serializer.save()
                else:
                    return Response({"error": location_serializer.errors},
                                    status=status.HTTP_400_BAD_REQUEST)
                for image in images:
                    try:
                        image_file = image.image.read()
                        file_name = f"{image.image.name.split('/')[-1]}"
                        new_file = ContentFile(image_file, name=file_name)
                        pet_listing_image = PetListingImage.objects.create(
                            pet_listing=pet_listing,
                            image=new_file
                        )
                        pet_listing_image.save()

                        image.delete()
                    except Exception as e:
                        return Response({"error": str(e)},
                                        status=status.HTTP_400_BAD_REQUEST)
                profile.petlisting_count += 1
                if not profile.IsSeller:
                    profile.IsSeller = True
                profile.save()
                return Response({"detail": PetListingRetrieveSerializer(
                    pet_listing).data}, status=status.HTTP_201_CREATED)
            else:
                return Response({"error": petListingSerializer.errors},
                                status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PetListingListView(APIView):
    def get(self, request):
        search_query = request.query_params.get('search', None)

        if search_query:
            pet_listings = PetListing.objects.filter(
                Q(description__icontains=search_query) | Q(
                    slug__icontains=search_query)
            )
        else:
            pet_listings = PetListing.objects.all()

        serializer = PetListingRetrieveSerializer(pet_listings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserFeedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = validate_authenticated_user(request)
            if isinstance(user, Response):
                return user
            users_list = list(
                user.following_relations.values_list(
                    "following_id", flat=True
                )
            )
            users_list.append(user.id)

            optional_fields = request.query_params.getlist("fields")
            optional_fields = optional_fields if optional_fields else None

            pawstories = Post.objects.filter(
                user__in=users_list
            ).order_by('-created_at')

            serialized_data = PostSerializer(
                pawstories, many=True,
                context={'optional_fields': optional_fields}
            ).data

            liked_post_ids = set(
                Like.objects.filter(user=user, post__in=pawstories)
                .values_list('post_id', flat=True)
            )

            for post in serialized_data:
                post['liked'] = post['id'] in liked_post_ids

            return Response(serialized_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class PetMarketplaceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = validate_authenticated_user(request)
            if isinstance(user, Response):
                return user
            pet_listings = PetListing.objects.filter(
                is_available=True
            ).order_by('-created_at')
            serialized_data = PetListingRetrieveSerializer(
                pet_listings, many=True
            ).data
            return Response(serialized_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@api_view(['GET'])
@permission_classes([IsAdminUser])
def post_engagement_metrics(request):
    pawstories_count = Post.objects.count()
    petselling_count = PetListing.objects.filter(post_type="Selling").count()
    petadoption_count = PetListing.objects.filter(post_type="Adoption").count()

    data = [
        {"name": "Listings", "value": petselling_count},
        {"name": "Adoption", "value": petadoption_count},
        {"name": "Stories", "value": pawstories_count},
    ]

    return Response(data)
