from django.contrib import admin
from .models import (Post, PostImage, PetListing, PetListingImage,
                     PetListingLocation)


class PostImageInline(admin.TabularInline):
    model = PostImage
    extra = 1


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('user', 'content', 'created_at', 'updated_at',
                    'likes_count', 'comment_count', 'shares_count')
    list_filter = ('created_at',)
    search_fields = ('content', 'user__username')
    inlines = [PostImageInline]


@admin.register(PostImage)
class PostImageAdmin(admin.ModelAdmin):
    list_display = ('post__content', 'post__user__username', 'image',
                    'created_at')
    list_filter = ('created_at',)
    search_fields = ('post__content',)


class PetListingImageInline(admin.TabularInline):
    model = PetListingImage
    extra = 1


class PetListingLocationInline(admin.StackedInline):
    model = PetListingLocation
    extra = 1


@admin.register(PetListing)
class PetListingAdmin(admin.ModelAdmin):
    list_display = ('pet_name', 'seller', 'price', 'is_available',
                    'is_sold_or_adopted', 'created_at')
    list_filter = ('is_available', 'is_sold_or_adopted', 'created_at',
                   'updated_at')
    search_fields = ('pet_name', 'seller__user__name')
    inlines = [PetListingImageInline, PetListingLocationInline]


@admin.register(PetListingImage)
class PetListingImageAdmin(admin.ModelAdmin):
    list_display = ('pet_listing', 'image', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('pet_listing__pet_name',)


@admin.register(PetListingLocation)
class PetListingLocationAdmin(admin.ModelAdmin):
    list_display = ('pet_listing', 'location_name', 'city', 'state',
                    'zip_code', 'latitude', 'longitude')
    search_fields = ('location_name', 'city', 'state', 'pet_listing__pet_name')
