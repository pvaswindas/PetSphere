from rest_framework import serializers
from .models import Post, PostImage


class PostSerializer(serializers.ModelSerializer):

    class Meta:
        model = Post
        fields = ['id', 'user', 'content', 'created_at', 'updated_at',
                  'likes_count', 'comment_count', 'shares_count']


class PostImageSerializer(serializers.ModelSerializer):
    post = serializers.PrimaryKeyRelatedField(queryset=Post.objects.all())

    class Meta:
        model = PostImage
        fields = ['id', 'post', 'image', 'created_at']
