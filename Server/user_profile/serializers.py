from rest_framework import serializers
from accounts.serializers import PetSphereUserSerializer
from .models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    user = PetSphereUserSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = [
            'id', 'user', 'bio', 'is_private', 'push_notification',
            'follower_count', 'following_count'
        ]
        read_only_fields = ['id', 'following_count', 'following_count']