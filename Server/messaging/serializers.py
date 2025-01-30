from rest_framework import serializers
from .models import Message, Conversation
from user_profile.serializers import ProfileSerializer


class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(
        source='sender.username', read_only=True
    )
    receiver_username = serializers.CharField(
        source='receiver.username', read_only=True
    )
    sender_profile = ProfileSerializer(
        source='sender.profile', read_only=True
    )
    receiver_profile = ProfileSerializer(
        source='receiver.profile', read_only=True
    )
    latest_message = serializers.CharField(
        source='content', read_only=True
    )
    timestamp = serializers.DateTimeField(
        format='%b, %d %Y at %I:%M %p', read_only=True
    )
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = [
            'id', 'sender', 'receiver', 'content', 'timestamp', 'read',
            'sender_username', 'receiver_username', 'latest_message',
            'unread_count', 'sender_profile', 'receiver_profile'
        ]

    def get_unread_count(self, obj):
        """
        Returns the unread count of messages for a specific conversation.
        This is calculated based on messages sent by the receiver to the
        current user.
        """
        user = self.context.get('user')
        unread_count = Message.objects.filter(
            sender=obj.receiver, receiver=user, read=False
        ).count()
        return unread_count


class ConversationSerializer(serializers.ModelSerializer):
    conversation_id = serializers.IntegerField(source='id', read_only=True)
    other_user = serializers.SerializerMethodField()
    latest_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()
    timestamp = serializers.DateTimeField(
        format='%b, %d %Y at %I:%M %p', read_only=True
    )

    class Meta:
        model = Conversation
        fields = [
            'conversation_id', 'other_user', 'latest_message',
            'unread_count', 'timestamp'
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

    def get_latest_message(self, obj):
        """
        Get the latest message content in the conversation.
        """
        latest_message = obj.messages.order_by('-timestamp').first()
        return latest_message.content if latest_message else ''

    def get_unread_count(self, obj):
        """
        Get the unread count for the conversation for the current user.
        """
        user = self.context.get('user')
        unread_count = Message.objects.filter(
            conversation=obj, receiver=user, read=False
        ).count()
        return unread_count
