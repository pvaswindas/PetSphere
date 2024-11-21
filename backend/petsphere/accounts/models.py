from django.contrib.auth.models import AbstractUser
from django.db import models


class PetSphereUser(AbstractUser):
    name = models.CharField(max_length=255)
    mobile_no = models.CharField(max_length=15, null=True, blank=True)
    profile_picture = models.ImageField(
        upload_to="profile_pics/",
        null=True,
        blank=True
        )
    updated_at = models.DateTimeField(auto_now=True)
    is_pending = models.BooleanField(default=False)
    is_suspended = models.BooleanField(default=False)

    first_name = None
    last_name = None

    def __str__(self):
        return self.username


class Profile(models.Model):
    user = models.OneToOneField(PetSphereUser, on_delete=models.CASCADE)
    bio = models.CharField(max_length=255, null=True, blank=True)
    is_private = models.BooleanField(default=False)
    push_notification = models.BooleanField(default=False)
    follower_count = models.PositiveBigIntegerField(default=0)
    following_count = models.PositiveBigIntegerField(default=0)
