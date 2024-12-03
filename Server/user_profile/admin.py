from django.contrib import admin
from .models import Profile


class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'bio', 'is_private', 'push_notification',
                    'follower_count', 'following_count')
    search_fields = ('user__username', 'bio')
    list_filter = ('is_private', 'push_notification')


admin.site.register(Profile, ProfileAdmin)
