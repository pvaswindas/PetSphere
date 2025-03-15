from django.contrib import admin
from .models import Reports


class ReportsAdmin(admin.ModelAdmin):
    list_display = (
        'type', 'created_at', 'updated_at', 'status',
        'is_deleted',
    )
    search_fields = ('type', 'description')
    list_filter = ('status', 'is_deleted')
    ordering = ('-created_at',)
    fields = (
        'type', 'description', 'reported_content', 'link_to_content',
        'reason', 'status', 'is_deleted',
    )


admin.site.register(Reports, ReportsAdmin)
