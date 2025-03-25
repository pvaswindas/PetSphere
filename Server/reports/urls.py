from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views


router = DefaultRouter()
router.register(r'report-content', views.ReportsViewSet, basename='reports')


urlpatterns = [
    path('', include(router.urls)),
    path(
        'handle-report-action/',
        views.handle_report_action,
        name='handle_report_action'
    ),
    path('stats/', views.report_stats, name='report-stats'),
    path(
        'admin/metrics/report-types/',
        views.report_types_stats,
        name='report-types'
    ),
    path(
        'admin/metrics/report-metrics/',
        views.report_metrics,
        name='report-metrics'
    ),
]
