from django.db import models
from accounts.models import PetSphereUser


class Profile(models.Model):
    user = models.OneToOneField(PetSphereUser, on_delete=models.CASCADE,
                                related_name='profile')
    bio = models.CharField(max_length=255, null=True, blank=True)
    cover_image = models.ImageField(
        upload_to="cover_pics/",
        null=True,
        blank=True,
        default='default_images/profile_cover.svg'
    )
    profile_picture = models.ImageField(
        upload_to="profile_pics/",
        null=True,
        blank=True,
        default='default_images/user_avatar.svg'
    )
    is_private = models.BooleanField(default=False)
    push_notification = models.BooleanField(default=False)
    pawstory_count = models.PositiveBigIntegerField(default=0)
    petlisting_count = models.PositiveBigIntegerField(default=0)
    follower_count = models.PositiveBigIntegerField(default=0)
    following_count = models.PositiveBigIntegerField(default=0)
    free_posts = models.PositiveBigIntegerField(default=3)
    IsSubscribed = models.BooleanField(default=False)
    IsSeller = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username
