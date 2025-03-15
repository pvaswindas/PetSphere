from rest_framework import serializers
from .models import Seller
from accounts.serializers import AccountDetailSerializer


class SellerSerializer(serializers.ModelSerializer):
    user = AccountDetailSerializer(read_only=True)

    class Meta:
        model = Seller
        fields = [
            'id', 'user', 'is_verified', 'joined_date', 'review_count',
            'rating', 'listing_count', 'total_sales', 'seller_level',
            'all_in_one_badge'
        ]
