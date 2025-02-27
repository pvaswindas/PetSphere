from django.contrib import admin
from .models import Announcements


class AnnouncementsAdmin(admin.ModelAdmin):
    list_display = (
        'title', 'created_at', 'updated_at', 'is_active',
        'is_deleted',
    )
    search_fields = ('title', 'content')
    list_filter = ('is_active', 'is_deleted')
    prepopulated_fields = {'slug': ('title',)}
    ordering = ('-created_at',)
    fields = (
        'title', 'content', 'icon', 'is_active',
        'is_deleted',
    )


admin.site.register(Announcements, AnnouncementsAdmin)
