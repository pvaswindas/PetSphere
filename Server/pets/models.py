from django.db import models
from django.utils.text import slugify


class Pet(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    slug = models.SlugField(max_length=255, unique=True)
    icon = models.ImageField(upload_to='pet_type_icons/', blank=True,
                             null=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class PetBreed(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    pet_type = models.ForeignKey(Pet, on_delete=models.CASCADE,
                                 related_name='breed')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    slug = models.SlugField(max_length=255, unique=True)
    icon = models.ImageField(upload_to='pet_breed_icons/', blank=True,
                             null=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
