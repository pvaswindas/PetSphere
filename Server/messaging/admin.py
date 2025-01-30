from django.contrib import admin
from .models import Message, Conversation
from django.utils.translation import gettext_lazy as _


class MessageAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'sender', 'receiver', 'conversation', 'content', 'timestamp',
        'read', 'sender_deleted', 'receiver_deleted', 'fully_deleted'
    )
    list_filter = (
        'read', 'timestamp', 'sender_deleted', 'receiver_deleted',
        'fully_deleted', 'conversation'
    )
    search_fields = (
        'sender__username', 'receiver__username', 'content', 'conversation__id'
    )
    ordering = ('-timestamp',)

    def get_readonly_fields(self, request, obj=None):
        if obj:
            return ['conversation']
        return []


class ConversationAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'get_participants', 'timestamp'
    )
    list_filter = (
        'timestamp',
    )
    search_fields = ('users__username',)
    ordering = ('-timestamp',)

    def get_participants(self, obj):
        return ", ".join([user.username for user in obj.users.all()])
    get_participants.short_description = _('Participants')


admin.site.register(Message, MessageAdmin)
admin.site.register(Conversation, ConversationAdmin)
