from django.contrib import admin
from .models import Pet, PetBreed


@admin.register(Pet)
class PetAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'created_at', 'updated_at')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}
    list_filter = ('created_at', 'updated_at')
    ordering = ('-created_at',)


@admin.register(PetBreed)
class PetBreedAdmin(admin.ModelAdmin):
    list_display = ('name', 'pet_type__name', 'slug', 'created_at',
                    'updated_at')
    search_fields = ('name', 'pet_type__name')
    prepopulated_fields = {'slug': ('name',)}
    list_filter = ('created_at', 'updated_at', 'pet_type')
    ordering = ('-created_at',)
