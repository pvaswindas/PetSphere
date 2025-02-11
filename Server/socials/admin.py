from django.contrib import admin
from .models import (
    Follower, Like, Comment, CommentLike
)


@admin.register(Follower)
class FollowerAdmin(admin.ModelAdmin):
    list_display = ('follower', 'following', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('follower__username', 'following__username')
    ordering = ('-created_at',)


@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = ('user', 'post', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username', 'post__content')
    raw_id_fields = ('user', 'post')
    list_select_related = ('user', 'post')
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('user', 'post', 'content', 'created_at', 'updated_at')
    list_filter = ('created_at',)
    search_fields = ('user__username', 'post__content')
    raw_id_fields = ('user', 'post')
    list_select_related = ('user', 'post')
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)


@admin.register(CommentLike)
class CommentLikeAdmin(admin.ModelAdmin):
    list_display = ('user', 'comment', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username', 'comment__post__content')
    raw_id_fields = ('user', 'comment')
    list_select_related = ('user', 'comment')
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)
