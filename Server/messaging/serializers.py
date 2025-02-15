from rest_framework import serializers
from .models import Message, Conversation
from django.conf import settings
from user_profile.serializers import ProfileSerializer


class ConversationSerializer(serializers.ModelSerializer):
    conversation_id = serializers.IntegerField(source='id', read_only=True)
    other_user = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = [
            'conversation_id', 'other_user', 'last_message',
            'last_message_timestamp'
        ]

    def get_other_user(self, obj):
        """
        Returns the profile of the other user in the conversation,
        excluding the authenticated user.
        """
        user = self.context.get('user')
        other_user = obj.users.exclude(id=user.id).first()

        return ProfileSerializer(
            other_user.profile
        ).data if other_user else None


class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(
        source="sender.username", read_only=True
    )
    receiver_username = serializers.CharField(
        source="receiver.username", read_only=True
    )
    conversation_id = serializers.IntegerField(
        source="conversation.id", read_only=True
    )
    media_url = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = [
            "id",
            "sender_username",
            "receiver_username",
            "content",
            "conversation_id",
            "media_url",
            "timestamp",
            "message_type",
            "read",
        ]

    def get_media_url(self, obj):
        """Returns the full absolute media URL without needing request."""
        if obj.media_file:
            return f"{settings.SITE_URL}{obj.media_file.url}"
        return None
