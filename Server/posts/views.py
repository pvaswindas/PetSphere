# Standard libraries
import redis
from django.conf import settings
from django.db.models import Q, Count
from django.shortcuts import get_object_or_404

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
    Post, PetListing, PetListingImage,
    SavedPost, PetListingLocation
)
from accounts.models import PetSphereUser
from socials.models import Like
from pets.models import Pet, PetBreed
from sellers.models import Seller
from .serializers import (
    PostSerializer, PostImageSerializer, PetListingCreateSerializer,
    PetListingRetrieveSerializer, AddPostSerializer,
    PetListingLocationSerializer
)
from petsphere.utils.common_utils import (
    validate_authenticated_user, validate_request_data,
)
from common.storage import upload_to_s3_from_multipart


encryption_key = settings.ENCRYPTION_KEY

cipher_suite = Fernet(encryption_key)

redis_client = redis.StrictRedis(
    host='redis', port=6379, db=0, decode_responses=True
)


class UserPostListCreateView(APIView):
    """
    Handles listing and creating user posts.
    Permissions:
        - Requires user to be authenticated.
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
        Creates a new post for the authenticated user with base64 encoded
        images.

        Parsers:
            - MultiPartParser
            - FormParser

        Required Fields:
            - content: Content/body of the post.
            - images: List of image.

        Returns:
            - Response: Created post data on success.
            - Response: Error details on failure.
        """
        try:
            user = validate_authenticated_user(request)
            if isinstance(user, Response):
                return user

            data = request.data.copy()
            data['user'] = user.id

            # Get base64 images from request data
            post_images = request.data.getlist('images', [])

            if any(not hasattr(img, 'read') for img in post_images):
                return Response(
                    {'error': 'Invalid image files provided'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            MAX_FILE_SIZE = 5 * 1024 * 1024

            for image in post_images:
                if image.size > MAX_FILE_SIZE:
                    return Response(
                        {'error': 'Image exceeds maximum size of 5MB'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            serializer = AddPostSerializer(
                data=data, context={'request': request}
            )
            profile = user.profile

            if serializer.is_valid():
                post = serializer.save()

                if post_images:
                    image_data = []

                    for image in post_images:

                        # Upload to S3 and get URL
                        image_url = upload_to_s3_from_multipart(
                            image,
                            s3_path="posts/images",
                            media_name=f"post_{post.id}{post.slug}"
                        )

                        if image_url:
                            image_data.append({
                                'post': post.id,
                                'image': image_url
                            })
                        else:
                            # If any image upload fails, delete the post and
                            # return error
                            post.delete()
                            return Response(
                                {'error': 'Image upload failed'},
                                status=status.HTTP_400_BAD_REQUEST
                            )

                    if image_data:
                        image_serializer = PostImageSerializer(
                            data=image_data,
                            many=True,
                            context={'request': request}
                        )
                        if image_serializer.is_valid():
                            image_serializer.save()
                        else:
                            # If serializer validation fails, delete the post
                            # and return error
                            post.delete()
                            return Response(
                                image_serializer.errors,
                                status=status.HTTP_400_BAD_REQUEST
                            )

                profile.pawstory_count += 1
                profile.save()
                return Response(
                    serializer.data, status=status.HTTP_201_CREATED
                )

            return Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {
                    "success": False,
                    "message": "Server Error",
                    "error": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


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


class UserListingListCreateView(APIView):
    """
    Handles listing and creating user posts.
    Permissions:
        - Requires user to be authenticated.
    """

    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        """
        Retrieves a list of listings created by the authenticated user.

        Parameters:
            - request: The HTTP request object containing user information.
            - username (optional): fetches listings for the specified user.

        Returns:
            - Response: A list of listings if they exist.
            - Response: A 204 status if no listings are found.
        """
        username = request.query_params.get("username")
        search_query = request.query_params.get('search', None)

        if search_query:
            pet_listings = PetListing.objects.filter(
                Q(description__icontains=search_query) | Q(
                    slug__icontains=search_query)
            )
        if username:
            user = get_object_or_404(PetSphereUser, username=username)
        else:
            user = validate_authenticated_user(request)
            if isinstance(user, Response):
                return user

        pet_listings = PetListing.objects.filter(seller__user=user)

        if not pet_listings:
            return Response({"detail": "No Listing found"},
                            status=status.HTTP_204_NO_CONTENT)
        serializer = PetListingRetrieveSerializer(
            pet_listings, many=True,
            context={'request': request}
        )
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
            images = request.data.getlist('images', [])
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

                        image_url = upload_to_s3_from_multipart(
                            image,
                            s3_path="listings/images",
                            media_name=f"listing_{pet_listing.id}"
                        )

                        if not image_url:
                            return Response(
                                {
                                    "success": False,
                                    "message": "Failed to upload icon",
                                    "error": "Image upload failed"
                                },
                                status=status.HTTP_400_BAD_REQUEST
                            )

                        pet_listing_image = PetListingImage.objects.create(
                            pet_listing=pet_listing,
                            image=image_url
                        )
                        pet_listing_image.save()

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


class PetListingsView(APIView):
    """
    Handles retrieving, updating, and deleting a listing by slug.

    Permissions:
        - AllowAny: Any user can access the view (no authentication required).

    Methods:
        - GET: Retrieves the details of a specific listing.
        - PATCH: Updates the details of a specific listing.
        - DELETE: Deletes the specified listing.
    """

    permission_classes = [AllowAny,]

    def get(self, request, slug):
        """
        Retrieves the details of a specific listing.

        Parameters:
            - request: The HTTP request object.
            - slug (str): The unique slug for the listing to retrieve.

        Workflow:
            1. Attempts to fetch the listing object using the provided slug.
            2. If the listing is found, serializes and returns the data.
            3. If the listing does not exist, returns a 404 response.

        Returns:
            - Response: Listing details if found (200 OK).
            - Response: Error message if listing not found (404 Not Found).
        """
        try:
            listing = PetListing.objects.get(slug=slug)
        except Post.DoesNotExist:
            return Response({"detail": "Post not found"},
                            status=status.HTTP_404_NOT_FOUND)

        serializer = PetListingRetrieveSerializer(
            listing, context={'request': request}
        )
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, slug):
        """
        Updates the details of a specific listing.

        Parameters:
            - request: The HTTP request object with the update data.
            - slug (str): The unique slug of the listing to update.

        Workflow:
            1. Fetches the listing by its slug.
            2. Removes the slug from the data to prevent modification.
            3. Serializes the data with the partial update option.
            4. If the data is valid, saves and returns the updated listing.
            5. If the data is invalid, returns validation errors.

        Returns:
            - Response: Updated listing data if successful (200 OK).
            - Response: Validation errors if update fails (400 Bad Request).
            - Response: Error message if listing not found (404 Not Found).
        """
        try:
            listing = PetListing.objects.get(slug=slug)
        except Post.DoesNotExist:
            return Response({"detail": "Listing not found"},
                            status=status.HTTP_404_NOT_FOUND)

        data = request.data.copy()
        data.pop('slug', None)

        serializer = PetListingCreateSerializer(
            listing, data=data, partial=True, context={'request': request}
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
            - slug (str): The unique slug of the listing to delete.

        Workflow:
            1. Attempts to fetch the listing by slug.
            2. Checks if the current user owns the listing.
            3. If authorized, deletes the post and returns a success message.
            4. If not authorized, returns a permission denied message.

        Returns:
            - Response: Success message if post is deleted (204 No Content).
            - Response: Forbidden if user is not the owner (403 Forbidden).
            - Response: Error message if listing not found (404 Not Found).
        """
        try:
            listing = PetListing.objects.get(slug=slug)
        except Post.DoesNotExist:
            return Response({"detail": "Listing not found"},
                            status=status.HTTP_404_NOT_FOUND)
        if listing.seller.user != request.user:
            return Response({"detail": "Permission denied"},
                            status=status.HTTP_403_FORBIDDEN)
        listing.delete()
        return Response({'detail': 'Listing Deleted Successfully'},
                        status=status.HTTP_204_NO_CONTENT)


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

    return Response(data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def pet_listings_location(request):
    """
    Retrieve pet listing location data for the admin dashboard treemap.
    Counts listings by city and state.
    """
    # Get location data grouped by state and city
    location_data = PetListingLocation.objects.values(
        'state', 'city'
    ).annotate(count=Count('id')).order_by('-count')

    result = []
    for item in location_data:
        result.append({
            'state': item['state'],
            'city': item['city'],
            'count': item['count']
        })

    return Response(result, status=status.HTTP_200_OK)
