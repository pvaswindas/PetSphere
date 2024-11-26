from django.db import models
from accounts.models import PetSphereUser


class Post(models.Model):
    user = models.ForeignKey(PetSphereUser, on_delete=models.CASCADE,
                             related_name='posts')
    content = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    likes_count = models.BigIntegerField(default=0)
    comment_count = models.BigIntegerField(default=0)
    shares_count = models.BigIntegerField(default=0)


class PostImage(models.Model):
    post = models.ForeignKey(Post, related_name='images',
                             on_delete=models.CASCADE)
    image = models.ImageField(upload_to='post_images/')
    created_at = models.DateTimeField(auto_now_add=True)
