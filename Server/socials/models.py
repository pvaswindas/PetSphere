from django.db import models
from accounts.models import PetSphereUser
from posts.models import Post
from django.core.exceptions import ValidationError


class Follower(models.Model):
    follower = models.ForeignKey(PetSphereUser, on_delete=models.CASCADE,
                                 related_name='following_relations')
    following = models.ForeignKey(PetSphereUser, on_delete=models.CASCADE,
                                  related_name='follower_relations')
    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
        if self.follower == self.following:
            raise ValidationError(
                "Follower and following cannot be same person"
            )

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)


class Like(models.Model):
    user = models.ForeignKey(PetSphereUser, on_delete=models.CASCADE,
                             related_name='like')
    post = models.ForeignKey(Post, on_delete=models.CASCADE,
                             related_name='like')
    created_at = models.DateTimeField(auto_now_add=True)


class Comment(models.Model):
    user = models.ForeignKey(PetSphereUser, on_delete=models.CASCADE,
                             related_name='comment')
    post = models.ForeignKey(Post, on_delete=models.CASCADE,
                             related_name='comment')
    content = models.TextField()
    parent = models.ForeignKey('self', on_delete=models.CASCADE,
                               null=True, blank=True, related_name='replies')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class CommentLike(models.Model):
    user = models.ForeignKey(PetSphereUser, on_delete=models.CASCADE,
                             related_name='commentlike')
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE,
                                related_name='commentlike')
    created_at = models.DateTimeField(auto_now_add=True)
