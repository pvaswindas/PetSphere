from django.db import models
from accounts.models import PetSphereUser
from sellers.models import Seller
from pets.models import Pet, PetBreed


class Post(models.Model):
    user = models.ForeignKey(PetSphereUser, on_delete=models.CASCADE,
                             related_name='posts')
    content = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    likes_count = models.PositiveBigIntegerField(default=0)
    comment_count = models.PositiveBigIntegerField(default=0)
    shares_count = models.PositiveBigIntegerField(default=0)


class PostImage(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE,
                             related_name='images')
    image = models.ImageField(upload_to='post_images/')
    created_at = models.DateTimeField(auto_now_add=True)


class PetListing(models.Model):
    post_type = models.CharField(max_length=30, default='Selling')
    seller = models.ForeignKey(Seller, on_delete=models.CASCADE,
                               related_name='listings')
    pet_name = models.CharField(max_length=255)
    pet_type = models.ForeignKey(Pet, on_delete=models.DO_NOTHING)
    breed = models.ForeignKey(PetBreed, on_delete=models.DO_NOTHING)
    description = models.TextField(null=True, blank=True)
    gender = models.CharField(max_length=15)
    age = models.PositiveBigIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_available = models.BooleanField(default=True)
    is_sold_or_adopted = models.BooleanField(default=False)


class PetListingImage(models.Model):
    pet_listing = models.ForeignKey(PetListing, on_delete=models.CASCADE,
                                    related_name='images')
    image = models.ImageField(upload_to='pet_listing_images/')
    created_at = models.DateTimeField(auto_now_add=True)


class PetListingLocation(models.Model):
    pet_listing = models.ForeignKey(PetListing, on_delete=models.CASCADE,
                                    related_name='location')
    location_name = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    state = models.CharField(max_length=255)
    zip_code = models.CharField(max_length=15)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)

    def __str__(self):
        return f"{self.pet_listing.pet_name} - {self.location_name}" \
            f" - {self.city}"
