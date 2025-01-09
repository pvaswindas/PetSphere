from rest_framework import serializers
from .models import (
    Comment
)


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
