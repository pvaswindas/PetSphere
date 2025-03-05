from django.db import models
from django.utils.text import slugify
from storages.backends.s3boto3 import S3Boto3Storage


class Announcements(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    slug = models.SlugField(max_length=255, unique=True)
    icon = models.ImageField(
        upload_to='accouncements/icon/',
        blank=True,
        null=True,
        storage=S3Boto3Storage(),
    )
    is_active = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)

        try:
            old_instance = Announcements.objects.get(pk=self.pk)

            if (
                old_instance.icon and
                old_instance.icon.name != self.icon.name
            ):
                old_instance.icon.delete(save=False)
        except Announcements.DoesNotExist:
            pass

        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        if self.icon:
            self.icon.delete(save=False)

        super().delete(*args, **kwargs)

    def __str__(self):
        return self.title
