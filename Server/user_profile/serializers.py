from rest_framework import serializers
from accounts.serializers import (
    AccountDetailSerializer
)
from .models import Profile
from urllib.parse import urljoin
from django.conf import settings


class ProfileSerializer(serializers.ModelSerializer):
    user = AccountDetailSerializer(read_only=True)
    cover_image = serializers.ImageField(required=False)

    class Meta:
        model = Profile
        fields = [
            'id', 'user', 'bio', 'cover_image', 'profile_picture',
            'pawstory_count', 'petlisting_count',
            'push_notification', 'follower_count', 'following_count',
            'free_posts', 'IsSubscribed', 'IsSeller'
        ]
        read_only_fields = ['id', 'follower_count', 'following_count']

    def get_absolute_url(self, url):
        if not url:
            return None
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(url)
        return urljoin(settings.BASE_URL, url)

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        # Convert image fields to absolute URLs
        if instance.cover_image:
            representation['cover_image'] = self.get_absolute_url(
                instance.cover_image.url
            )
        if instance.profile_picture:
            representation['profile_picture'] = self.get_absolute_url(
                instance.profile_picture.url
            )

        # **Handle optional fields logic**
        optional_fields = self.context.get('optional_fields', None)

        if optional_fields:
            return {
                key: value for key, value in representation.items()
                if key in optional_fields
            }

        return representation
