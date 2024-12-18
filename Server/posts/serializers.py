from rest_framework import serializers
from .models import Post, PostImage
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
