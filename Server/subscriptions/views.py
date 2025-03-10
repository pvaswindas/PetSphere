import stripe
from django.db.models import Sum
from django.conf import settings
from rest_framework import status
from django.http import JsonResponse
from datetime import datetime, timedelta
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
    today = datetime.now()
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
