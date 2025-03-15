from rest_framework import serializers
from .models import (
    Post, PostImage, PetListing, PetListingImage, PetListingLocation
)
from user_profile.serializers import ProfileSerializer


class PostImageSerializer(serializers.ModelSerializer):
    post = serializers.PrimaryKeyRelatedField(queryset=Post.objects.all())

    class Meta:
        model = PostImage
        fields = ['id', 'post', 'image', 'created_at']


class AddPostSerializer(serializers.ModelSerializer):

    class Meta:
        model = Post
        fields = [
            'id', 'user', 'content', 'slug', 'created_at',
            'updated_at', 'like_count', 'comment_count', 'save_count',
            'hide_likes', 'hide_comments', 'turn_off_comments'
        ]
        read_only_fields = ['slug']


class PostSerializer(serializers.ModelSerializer):
    user_profile = serializers.SerializerMethodField()
    images = PostImageSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = [
            'id', 'user_profile', 'content', 'slug', 'created_at',
            'updated_at', 'like_count', 'comment_count', 'save_count',
            'images', 'hide_likes', 'hide_comments', 'turn_off_comments'
        ]
        read_only_fields = ['slug']

    def get_user_profile(self, obj):
        """Pass optional_fields context to ProfileSerializer"""
        optional_fields = self.context.get('optional_fields', None)
        return ProfileSerializer(
            obj.user.profile,
            context={'optional_fields': optional_fields}
        ).data


class PetListingImageSerializer(serializers.ModelSerializer):
    pet_listing = serializers.PrimaryKeyRelatedField(
        queryset=PetListing.objects.all()
    )

    class Meta:
        model = PetListingImage
        fields = ['id', 'pet_listing', 'image', 'created_at']


class PetListingLocationSerializer(serializers.ModelSerializer):
    pet_listing = serializers.PrimaryKeyRelatedField(
        queryset=PetListing.objects.all()
    )

    class Meta:
        model = PetListingLocation
        fields = ['id', 'pet_listing', 'address', 'city', 'state',
                  'zip_code', 'latitude', 'longitude'
                  ]
        read_only_fields = ['pet_listing']


class PetListingCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = PetListing
        fields = [
            'id', 'post_type', 'seller', 'pet_name', 'pet_type', 'breed',
            'slug', 'description', 'gender', 'age', 'price', 'created_at',
            'updated_at', 'is_available', 'is_sold_or_adopted'
        ]
        read_only_fields = ['slug']


class PetListingRetrieveSerializer(serializers.ModelSerializer):
    images = PetListingImageSerializer(many=True, read_only=True)
    location = PetListingLocationSerializer()
    user_profile = serializers.SerializerMethodField()

    pet_type = serializers.SerializerMethodField()
    breed = serializers.SerializerMethodField()

    class Meta:
        model = PetListing
        fields = [
            'id', 'post_type', 'user_profile', 'pet_name', 'pet_type', 'breed',
            'slug', 'description', 'gender', 'age', 'price', 'created_at',
            'updated_at', 'is_available', 'is_sold_or_adopted', 'images',
            'location'
        ]
        read_only_fields = ['slug']

    def get_pet_type(self, obj):
        return obj.pet_type.name if obj.pet_type else None

    def get_breed(self, obj):
        return obj.breed.name if obj.breed else None

    def get_user_profile(self, obj):
        """Pass optional_fields context to ProfileSerializer"""
        optional_fields = self.context.get('optional_fields', None)
        return ProfileSerializer(
            obj.seller.user.profile,
            context={'optional_fields': optional_fields}
        ).data
