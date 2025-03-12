from django.urls import path
from .views import (
    CreateCheckoutSession, stripe_webhook,
    PlanListView, get_revenue, get_geographic_listing_data,
    get_subscription_revenue_data, get_subscription_status_data
)


urlpatterns = [
    path('checkout-session/', CreateCheckoutSession.as_view(),
         name='create-subscription'),
    path('plans/', PlanListView.as_view(), name='plan-list'),
    path('stripe/webhook/', stripe_webhook, name='stripe-webhook'),
    path('get-revenue/', get_revenue, name='get-revenue'),
    path(
        'metrics/subscription-revenue/',
        get_subscription_revenue_data,
        name='subscription_revenue_metrics'
    ),
    path(
        'metrics/subscription-status/',
        get_subscription_status_data,
        name='subscription_status_metrics'
    ),
    path(
        'metrics/geographic-listings/',
        get_geographic_listing_data,
        name='geographic_listing_metrics'
    )
]
