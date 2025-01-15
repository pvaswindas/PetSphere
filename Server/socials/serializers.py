from rest_framework import serializers
from .models import (
    Comment, CommentLike
)


class CommentLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentLike
        fields = ['user', 'created_at']


class CommentSerializer(serializers.ModelSerializer):
    replies = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField()
    comment_likes = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            'id', 'user', 'username', 'post', 'content', 'parent', 'replies',
            'created_at', 'updated_at', 'comment_likes'
        ]

    def get_replies(self, obj):
        if obj.replies.exists():
            return CommentSerializer(obj.replies.all(), many=True).data
        return []

    def get_username(self, obj):
        return obj.user.username

    def get_comment_likes(self, obj):
        likes = obj.commentlike.all()
        return CommentLikeSerializer(likes, many=True).data
