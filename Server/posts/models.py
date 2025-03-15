from django.db import models
from django.utils.text import slugify
import uuid
from accounts.models import PetSphereUser
from sellers.models import Seller
from pets.models import Pet, PetBreed


class Post(models.Model):
    user = models.ForeignKey(PetSphereUser, on_delete=models.CASCADE,
                             related_name='posts')
    content = models.TextField(null=True, blank=True)
    slug = models.SlugField(unique=True, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    like_count = models.PositiveBigIntegerField(default=0)
    comment_count = models.PositiveBigIntegerField(default=0)
    save_count = models.PositiveBigIntegerField(default=0)
    hide_likes = models.BooleanField(default=False)
    hide_comments = models.BooleanField(default=False)
    turn_off_comments = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if self.pk:
            original = Post.objects.get(pk=self.pk)
            if original.content != self.content:
                self.updated_at = self.created_at
        super().save(*args, **kwargs)

    def __str__(self):
        return self.content[:50]


class PostImage(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE,
                             related_name='images')
    image = models.URLField(
        null=True,
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)


class SavedPost(models.Model):
    user = models.ForeignKey(
        PetSphereUser, on_delete=models.CASCADE, related_name='saved_post'
    )
    post = models.ForeignKey(
        Post, on_delete=models.CASCADE, related_name='saved_by'
    )
    created_at = models.DateTimeField(auto_now_add=True)


class PetListing(models.Model):
    post_type = models.CharField(max_length=30, default='Selling')
    seller = models.ForeignKey(Seller, on_delete=models.CASCADE,
                               related_name='listings')
    pet_name = models.CharField(max_length=255)
    pet_type = models.ForeignKey(Pet, on_delete=models.DO_NOTHING)
    breed = models.ForeignKey(PetBreed, on_delete=models.DO_NOTHING)
    description = models.TextField(null=True, blank=True)
    slug = models.SlugField(unique=True, blank=True, null=True)
    gender = models.CharField(max_length=15)
    age = models.PositiveBigIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_available = models.BooleanField(default=True)
    is_sold_or_adopted = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.pet_name} {self.post_type} {self.pet_type} {self.breed}"

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.pet_name)

            self.slug = base_slug

            if PetListing.objects.filter(slug=self.slug).exists():
                unique_id = str(uuid.uuid4()).split('-')[0]
                self.slug = f"{base_slug}-{unique_id}"

        super().save(*args, **kwargs)


class PetListingImage(models.Model):
    pet_listing = models.ForeignKey(PetListing, on_delete=models.CASCADE,
                                    related_name='images')
    image = models.URLField(
        null=True,
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)


class PetListingLocation(models.Model):
    pet_listing = models.OneToOneField(PetListing, on_delete=models.CASCADE,
                                       related_name='location')
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    state = models.CharField(max_length=255)
    zip_code = models.CharField(max_length=15)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)

    def save(self, *args, **kwargs):
        self.latitude = round(self.latitude, 6)
        self.longitude = round(self.longitude, 6)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.pet_listing.pet_name} - {self.address}" \
            f" - {self.city}"
