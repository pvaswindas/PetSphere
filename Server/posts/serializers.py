from rest_framework import serializers
from .models import (
    Post, PostImage, PetListing, PetListingImage, PetListingLocation,
    PetListingImageTemp, Comment
)
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


class PostSerializer(serializers.ModelSerializer):
    images = PostImageSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'user', 'content', 'slug', 'created_at', 'updated_at',
                  'likes_count', 'comment_count', 'shares_count', 'images']
        read_only_fields = ['slug']


class CommentSerializer(serializers.ModelSerializer):
    replies = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            'id', 'user', 'username', 'post', 'content', 'parent', 'replies',
            'created_at', 'updated_at'
        ]

    def get_replies(self, obj):
        if obj.replies.exists():
            return CommentSerializer(obj.replies.all(), many=True).data
        return []

    def get_username(self, obj):
        return obj.user.username


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
    location = PetListingLocation()

    class Meta:
        model = PetListing
        fields = [
            'id', 'post_type', 'seller', 'pet_name', 'pet_type', 'breed',
            'slug', 'description', 'gender', 'age', 'price', 'created_at',
            'updated_at', 'is_available', 'is_sold_or_adopted', 'images',
            'location'
        ]
        read_only_fields = ['slug']
