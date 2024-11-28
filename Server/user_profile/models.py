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
    )
    is_private = models.BooleanField(default=False)
    push_notification = models.BooleanField(default=False)
    follower_count = models.PositiveBigIntegerField(default=0)
    following_count = models.PositiveBigIntegerField(default=0)

    def __str__(self):
        return self.user.username
