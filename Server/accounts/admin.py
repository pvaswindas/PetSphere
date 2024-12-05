from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import PetSphereUser


class PetSphereUserAdmin(UserAdmin):
    model = PetSphereUser
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('name', 'email', 'mobile_no')}),
        ('Permissions', {'fields': ('is_active', 'is_pending', 'is_suspended',
                                    'is_staff', 'is_superuser')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2', 'email', 'name'),
        }),
    )


admin.site.register(PetSphereUser, PetSphereUserAdmin)
