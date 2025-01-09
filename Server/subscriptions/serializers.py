from rest_framework import serializers
from .models import Plan


class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = [
            'id', 'name', 'description', 'stripe_product_id',
            'stripe_price_id', 'plan_type', 'price'
        ]
