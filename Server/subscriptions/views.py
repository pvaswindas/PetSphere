import stripe
from django.conf import settings
from rest_framework import status
from posts.models import PetListingLocation
from django.db.models import Count, Sum
from django.utils import timezone
import datetime
from django.http import JsonResponse
from datetime import timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAuthenticated, IsAdminUser
import stripe.error
from rest_framework.decorators import api_view, permission_classes
from petsphere.utils.common_utils import validate_authenticated_user
from .models import (
    Plan, Payment, Subscription, Recharge
)
from .serializers import (
    PlanSerializer
)


stripe.api_key = settings.STRIPE_SECRET_KEY
success_url = settings.STRIPE_SUCCESS_URL
cancel_url = settings.STRIPE_CANCEL_URL


def sync_stripe_products():
    products = stripe.Product.list()

    for product in products['data']:
        prices = stripe.Price.list(product=product['id'])
        for price in prices:
            if 'Recharge' in product['name']:
                plan_type = 'recharge'
            elif 'Monthly' in product['name']:
                plan_type = 'monthly'
            elif 'Yearly' in product['name']:
                plan_type = 'yearly'
            else:
                continue

            Plan.objects.update_or_create(
                stripe_product_id=product['id'],
                stripe_price_id=price['id'],
                defaults={
                    'name': product['name'],
                    'description': product['description'],
                    'plan_type': plan_type,
                    'price': price['unit_amount'] / 100,
                },
            )


class CreateCheckoutSession(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = validate_authenticated_user(request)
        if isinstance(user, Response):
            return user

        plan_id = request.data.get('plan_id')

        try:
            plan = Plan.objects.get(id=plan_id)
            mode = (
                'subscription'
                if plan.plan_type in ['monthly', 'yearly']
                else 'payment'
            )

            if mode == 'subscription':
                stripe_price_id = plan.stripe_price_id
                checkout_session = stripe.checkout.Session.create(
                    payment_method_types=['card'],
                    line_items=[
                        {
                            'price': stripe_price_id,
                            'quantity': 1,
                        },
                    ],
                    mode=mode,
                    success_url=success_url,
                    cancel_url=cancel_url,
                    customer_email=user.email
                )
            else:
                checkout_session = stripe.checkout.Session.create(
                    payment_method_types=['card'],
                    line_items=[
                        {
                            'price_data': {
                                'currency': 'usd',
                                'product': plan.stripe_product_id,
                                'unit_amount': int(plan.price * 100),
                            },
                            'quantity': 1,
                        },
                    ],
                    mode=mode,
                    success_url=success_url,
                    cancel_url=cancel_url,
                    customer_email=user.email
                )

            # Saving payment information
            Payment.objects.create(
                user=user,
                plan=plan,
                stripe_payment_id=checkout_session.id,
                status='pending',
            )

            if mode == 'subscription':
                user.profile.IsSubscribed = True
            else:
                user.profile.free_posts += 10

            user.profile.save()

            return Response(
                {'id': checkout_session.id, 'url': checkout_session.url},
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response({'error': str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META['HTTP_STRIPE_SIGNATURE']
    webhook_key = settings.STRIPE_WEBHOOK_SECRET
    webhook_secret = webhook_key
    event = None

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, webhook_secret
        )
    except ValueError as e:
        return JsonResponse({"error": str(e)}, status=400)
    except stripe.error.SignatureVerificationError as e:
        return JsonResponse({'error': str(e)}, status=400)

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']

        try:
            payment = Payment.objects.get(stripe_payment_id=session.id)

            payment.status = 'completed'
            payment.save()

            if payment.plan.plan_type in ['monthly', 'yearly']:
                Subscription.objects.create(
                    user=payment.user,
                    plan=payment.plan,
                    payment=payment,
                    status='active',
                )
            else:
                Recharge.objects.create(
                    user=payment.user,
                    plan=payment.plan,
                    payment=payment,
                    status='active',
                )
        except Payment.DoesNotExist:
            return JsonResponse({'error': 'Payment not found'}, status=404)
    return JsonResponse({'status': 'success'})


class PlanListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            plans = Plan.objects.all()
            serializer = PlanSerializer(plans, many=True)
            return Response(serializer.data, status=200)
        except Exception as e:
            return Response({'error': str(e)}, status=500)


# ------------------------------ Admin Insights ------------------------------
@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_revenue(request):
    today = datetime.datetime.now()
    first_day_of_this_month = today.replace(day=1)
    first_day_of_last_month = (
        first_day_of_this_month - timedelta(days=1)
    ).replace(day=1)

    # Total revenue
    total_subscription_revenue = Subscription.objects.aggregate(
        total=Sum('payment__plan__price')
    )['total'] or 0

    total_recharge_revenue = Recharge.objects.aggregate(
        total=Sum('payment__plan__price')
    )['total'] or 0

    total_revenue = total_subscription_revenue + total_recharge_revenue

    # This month revenue
    this_month_subscription_revenue = Subscription.objects.filter(
        start_date__gte=first_day_of_this_month
    ).aggregate(total=Sum('payment__plan__price'))['total'] or 0

    this_month_recharge_revenue = Recharge.objects.filter(
        start_date__gte=first_day_of_last_month
    ).aggregate(total=Sum('payment__plan__price'))['total'] or 0

    revenue_this_month = (
        this_month_subscription_revenue + this_month_recharge_revenue
    )

    # Last month revenue
    last_month_subscription_revenue = Subscription.objects.filter(
        start_date__gte=first_day_of_last_month,
        start_date__lt=first_day_of_this_month
    ).aggregate(total=Sum('payment__plan__price'))['total'] or 0

    last_month_recharge_revenue = Recharge.objects.filter(
        start_date__gte=first_day_of_last_month,
        start_date__lt=first_day_of_this_month
    ).aggregate(total=Sum('payment__plan__price'))['total'] or 0

    revenue_last_month = (
        last_month_subscription_revenue + last_month_recharge_revenue
    )

    data = {
        'total_revenue': total_revenue,
        'revenue_this_month': revenue_this_month,
        'revenue_last_month': revenue_last_month,
    }

    return Response(data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_subscription_revenue_data(request):
    """
    Returns revenue data for subscriptions by plan type over the last 6 months
    """
    # Get the last 6 months
    end_date = timezone.now()
    start_date = end_date - datetime.timedelta(days=180)

    # Generate month labels
    months = []
    current = start_date
    while current <= end_date:
        months.append(current.strftime('%b %Y'))
        # Move to next month
        next_month = current.month + 1
        next_year = current.year
        if next_month > 12:
            next_month = 1
            next_year += 1
        current = current.replace(year=next_year, month=next_month, day=1)

    revenue_data = {
        'months': months,
        'recharge': [0] * len(months),
        'monthly': [0] * len(months),
        'yearly': [0] * len(months)
    }

    # Get all payments within the date range
    payments = Payment.objects.filter(
        created_at__gte=start_date,
        created_at__lte=end_date,
        status='completed'
    ).select_related('plan')

    # Aggregate payment data by month and plan type
    for payment in payments:
        payment_date = payment.created_at
        month_idx = (
            payment_date.year - start_date.year
        ) * 12 + payment_date.month - start_date.month

        if 0 <= month_idx < len(months):
            plan_type = payment.plan.plan_type
            if plan_type in revenue_data:
                revenue_data[plan_type][month_idx] += float(payment.plan.price)

    return Response(revenue_data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_subscription_status_data(request):
    """
    Returns data on subscription status breakdown
    (active/inactive/canceled by plan type)
    """
    today = timezone.now()

    active_subscriptions = Subscription.objects.filter(
        end_date__gt=today,
        status='active'
    ).values('plan__plan_type').annotate(count=Count('id'))

    active_recharges = Recharge.objects.filter(
        end_date__gt=today,
        balance__gt=0,
        status='active'
    ).count()

    inactive_subscriptions = Subscription.objects.filter(
        end_date__lte=today,
        status='active'
    ).values('plan__plan_type').annotate(count=Count('id'))

    inactive_recharges = Recharge.objects.filter(
        end_date__lte=today,
        status='active'
    ).count()

    canceled_subscriptions = Subscription.objects.filter(
        status='canceled'
    ).values('plan__plan_type').annotate(count=Count('id'))

    canceled_recharges = Recharge.objects.filter(
        status='canceled'
    ).count()

    result = {
        'categories': ['Active', 'Inactive', 'Canceled'],
        'recharge': [
            active_recharges,
            inactive_recharges,
            canceled_recharges
        ],
        'monthly': [
            next(
                (item['count'] for item in active_subscriptions
                 if item['plan__plan_type'] == 'monthly'),
                0
            ),
            next(
                (item['count'] for item in inactive_subscriptions
                 if item['plan__plan_type'] == 'monthly'),
                0
            ),
            next(
                (item['count'] for item in canceled_subscriptions
                 if item['plan__plan_type'] == 'monthly'),
                0
            ),
        ],
        'yearly': [
            next(
                (item['count'] for item in active_subscriptions
                 if item['plan__plan_type'] == 'yearly'),
                0
            ),
            next(
                (item['count'] for item in inactive_subscriptions
                 if item['plan__plan_type'] == 'yearly'),
                0
            ),
            next(
                (item['count'] for item in canceled_subscriptions
                 if item['plan__plan_type'] == 'yearly'),
                0
            ),
        ]
    }

    return Response(result)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_geographic_listing_data(request):
    """
    Returns data on pet listings by geographic region
    """

    listing_by_region = PetListingLocation.objects.values('state')\
        .annotate(count=Count('id'))\
        .order_by('-count')

    state = []
    counts = []

    for item in listing_by_region:
        state.append(item['state'])
        counts.append(item['count'])

    result = {
        'state': state,
        'counts': counts
    }

    return Response(result)
