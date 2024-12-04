from rest_framework import serializers
from accounts.serializers import PetSphereUserSerializer
from .models import Profile
from urllib.parse import urljoin
from django.conf import settings


class ProfileSerializer(serializers.ModelSerializer):
    user = PetSphereUserSerializer(read_only=True)
    cover_image = serializers.ImageField(required=False)

    class Meta:
        model = Profile
        fields = [
            'id', 'user', 'bio', 'cover_image', 'is_private',
            'push_notification', 'follower_count', 'following_count'
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
        if instance.cover_image:
            representation['cover_image'] = self.get_absolute_url(
                instance.cover_image.url
            )
        return representation
