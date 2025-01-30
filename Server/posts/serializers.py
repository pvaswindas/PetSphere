from rest_framework import serializers
from .models import (
    Post, PostImage, PetListing, PetListingImage, PetListingLocation,
    PetListingImageTemp
)
from user_profile.serializers import ProfileSerializer
from urllib.parse import urljoin
from django.conf import settings


class PostImageSerializer(serializers.ModelSerializer):
    post = serializers.PrimaryKeyRelatedField(queryset=Post.objects.all())

    class Meta:
        model = PostImage
        fields = ['id', 'post', 'image', 'created_at']

    def get_absolute_url(self, url):
        if not url:
            return None
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(url)
        return urljoin(settings.BASE_URL, url)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.image:
            representation['image'] = self.get_absolute_url(
                instance.image.url
            )
        return representation


class AddPostSerializer(serializers.ModelSerializer):
    images = PostImageSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = [
            'id', 'user', 'content', 'slug', 'created_at',
            'updated_at', 'like_count', 'comment_count', 'save_count',
            'images', 'hide_likes', 'hide_comments', 'turn_off_comments'
        ]
        read_only_fields = ['slug']


class PostSerializer(serializers.ModelSerializer):
    user_profile = ProfileSerializer(source="user.profile", read_only=True)
    images = PostImageSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = [
            'id', 'user_profile', 'content', 'slug', 'created_at',
            'updated_at', 'like_count', 'comment_count', 'save_count',
            'images', 'hide_likes', 'hide_comments', 'turn_off_comments'
        ]
        read_only_fields = ['slug']


class PetListingImageSerializer(serializers.ModelSerializer):
    pet_listing = serializers.PrimaryKeyRelatedField(
        queryset=PetListing.objects.all()
    )

    class Meta:
        model = PetListingImage
        fields = ['id', 'pet_listing', 'image', 'created_at']

    def get_absolute_url(self, url):
        if not url:
            return None
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(url)
        return urljoin(settings.BASE_URL, url)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.image:
            representation['image'] = self.get_absolute_url(
                instance.image.url
            )
        return representation


class PetListingImageTempSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetListingImageTemp
        fields = '__all__'


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

    class Meta:
        model = PetListing
        fields = [
            'id', 'post_type', 'seller', 'pet_name', 'pet_type', 'breed',
            'slug', 'description', 'gender', 'age', 'price', 'created_at',
            'updated_at', 'is_available', 'is_sold_or_adopted', 'images',
            'location'
        ]
        read_only_fields = ['slug']
