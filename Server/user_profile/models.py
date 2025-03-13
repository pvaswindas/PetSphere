from django.db import models
from accounts.models import PetSphereUser


class Profile(models.Model):
    user = models.OneToOneField(
        PetSphereUser, on_delete=models.CASCADE, related_name="profile"
    )
    bio = models.CharField(max_length=255, null=True, blank=True)
    cover_image = models.URLField(
        null=True,
        blank=True,
    )
    profile_picture = models.URLField(
        null=True,
        blank=True,
    )
    push_notification = models.BooleanField(default=True)
    pawstory_count = models.PositiveBigIntegerField(default=0)
    petlisting_count = models.PositiveBigIntegerField(default=0)
    follower_count = models.PositiveBigIntegerField(default=0)
    following_count = models.PositiveBigIntegerField(default=0)
    free_posts = models.PositiveBigIntegerField(default=3)
    IsSubscribed = models.BooleanField(default=False)
    IsSeller = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username
