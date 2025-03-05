from django.db import models
from accounts.models import PetSphereUser
from storages.backends.s3boto3 import S3Boto3Storage


class Profile(models.Model):
    user = models.OneToOneField(
        PetSphereUser, on_delete=models.CASCADE, related_name="profile"
    )
    bio = models.CharField(max_length=255, null=True, blank=True)
    cover_image = models.ImageField(
        upload_to="cover_pics/",
        null=True,
        blank=True,
        storage=S3Boto3Storage(),
    )
    profile_picture = models.ImageField(
        upload_to="profile_pics/",
        null=True,
        blank=True,
        storage=S3Boto3Storage(),
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

    def save(self, *args, **kwargs):
        try:
            old_instance = Profile.objects.get(pk=self.pk)

            if (
                old_instance.profile_picture and
                old_instance.profile_picture.name != self.profile_picture.name
            ):
                old_instance.profile_picture.delete(save=False)

            if (
                old_instance.cover_image
                and old_instance.cover_image.name != self.cover_image.name
            ):
                old_instance.cover_image.delete(save=False)

        except Profile.DoesNotExist:
            pass

        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        if self.profile_picture:
            self.profile_picture.delete(save=False)

        if self.cover_image:
            self.cover_image.delete(save=False)

        super().delete(*args, **kwargs)
