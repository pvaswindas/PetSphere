from django.contrib import admin
from .models import Profile


class ProfileAdmin(admin.ModelAdmin):
    list_display = (
        'user', 'push_notification', 'pawstory_count',
        'petlisting_count', 'follower_count', 'following_count'
    )
    search_fields = ('user__username', 'bio')
    list_filter = ('push_notification',)


admin.site.register(Profile, ProfileAdmin)
