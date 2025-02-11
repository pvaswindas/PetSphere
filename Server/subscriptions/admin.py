from django.contrib import admin
from .models import (
    Plan, Payment, Subscription, Recharge
)


class PlanAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'stripe_product_id', 'stripe_price_id', 'plan_type',
        'price',
    )
    search_fields = ('name', 'stripe_product_id', 'plan_type')
    list_filter = ('plan_type',)

    def get_readonly_fields(self, request, obj=None):
        return [field.name for field in self.model._meta.fields]


admin.site.register(Plan, PlanAdmin)


class PaymentAdmin(admin.ModelAdmin):
    list_display = (
        'user', 'stripe_payment_id', 'plan',
        'status', 'created_at'
    )
    list_filter = ('status', 'created_at')
    search_fields = ('user', 'stripe_payment_id', 'plan')


admin.site.register(Payment, PaymentAdmin)


class SubscriptionAdmin(admin.ModelAdmin):
    list_display = (
        'user', 'plan', 'payment',
        'start_date', 'end_date', 'status',
    )
    list_filter = ('status', 'start_date', 'end_date')
    search_fields = ('user', 'plan', 'payment')


admin.site.register(Subscription, SubscriptionAdmin)


class RechargeAdmin(admin.ModelAdmin):
    list_display = (
        'user', 'plan', 'payment', 'balance',
        'start_date', 'end_date', 'status',
    )
    list_filter = ('status', 'start_date', 'end_date')
    search_fields = ('user', 'plan', 'payment')


admin.site.register(Recharge, RechargeAdmin)
