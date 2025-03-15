from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.http import JsonResponse
from django.conf.urls.static import static


def health_check(request):
    return JsonResponse({"status": "ok"})


urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('allauth.urls')),
    path("api/health-check/", health_check),
    path('api/accounts/', include('accounts.urls')),
    path('api/messaging/', include('messaging.urls')),
    path('api/video-call/', include('videocall.urls')),
    path('api/notification/', include('notifications.urls')),
    path('api/announcements/', include('announcements.urls')),
    path('api/user/', include('user_profile.urls')),
    path('api/posts/', include('posts.urls')),
    path('api/pet/', include('pets.urls')),
    path('api/socials/', include('socials.urls')),
    path('api/subscription/', include('subscriptions.urls')),
    path('api/reports/', include('reports.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns += static(
        settings.STATIC_URL, document_root=settings.STATIC_ROOT
    )
