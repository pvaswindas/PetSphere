from rest_framework import serializers
from accounts.serializers import AccountDetailSerializer
from .models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    user = AccountDetailSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = [
            'id', 'user', 'bio', 'cover_image', 'profile_picture',
            'pawstory_count', 'petlisting_count',
            'push_notification', 'follower_count', 'following_count',
            'free_posts', 'IsSubscribed', 'IsSeller'
        ]
        read_only_fields = ['id', 'follower_count', 'following_count']

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        if self.context.get('only_username', False):
            representation['user'] = instance.user.username

        # **Handle optional fields logic**
        optional_fields = self.context.get('optional_fields', None)

        if optional_fields:
            return {
                key: value for key, value in representation.items()
                if key in optional_fields
            }

        return representation
