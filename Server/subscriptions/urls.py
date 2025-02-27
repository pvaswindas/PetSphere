from django.urls import path
from .views import (
    CreateCheckoutSession, stripe_webhook,
    PlanListView, get_revenue,
)


urlpatterns = [
    path('checkout-session/', CreateCheckoutSession.as_view(),
         name='create-subscription'),
    path('plans/', PlanListView.as_view(), name='plan-list'),
    path('stripe/webhook/', stripe_webhook, name='stripe-webhook'),
    path('get-revenue/', get_revenue, name='get-revenue'),
]
