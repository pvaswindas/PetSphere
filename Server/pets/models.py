from django.db import models
from django.utils.text import slugify
from storages.backends.s3boto3 import S3Boto3Storage


class Pet(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    slug = models.SlugField(max_length=255, unique=True)
    icon = models.ImageField(
        upload_to='pet_type_icons/',
        blank=True,
        null=True,
        storage=S3Boto3Storage(),
    )

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)

        try:
            old_instance = Pet.objects.get(pk=self.pk)

            if (
                old_instance.icon and
                old_instance.icon.name != self.icon.name
            ):
                old_instance.icon.delete(save=False)
        except Pet.DoesNotExist:
            pass

        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class PetBreed(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    pet_type = models.ForeignKey(Pet, on_delete=models.CASCADE,
                                 related_name='breed')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    slug = models.SlugField(max_length=255, unique=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
