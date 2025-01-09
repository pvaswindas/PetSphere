from django.db import models
from datetime import timedelta
from django.utils import timezone
from accounts.models import PetSphereUser

current_date = timezone.now()


class Plan(models.Model):
    PLAN_CHOICES = [
        ('recharge', 'Recharge'),
        ('monthly', 'Monthly'),
        ('yearly', 'Yearly'),
    ]
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    stripe_product_id = models.CharField(max_length=100, unique=True)
    stripe_price_id = models.CharField(max_length=100, unique=True)
    plan_type = models.CharField(
        max_length=50, choices=PLAN_CHOICES, unique=True
    )
    price = models.DecimalField(max_digits=6, decimal_places=2, unique=True)


class Payment(models.Model):
    user = models.ForeignKey(PetSphereUser, on_delete=models.CASCADE)
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE)
    stripe_payment_id = models.CharField(max_length=100)
    status = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)


class Subscription(models.Model):
    user = models.ForeignKey(PetSphereUser, on_delete=models.CASCADE)
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE)
    payment = models.ForeignKey(Payment, on_delete=models.CASCADE)
    start_date = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=50)

    def save(self, *args, **kwargs):

        if not self.end_date and self.plan.plan_type in ['monthly', 'yearly']:
            if self.plan.plan_type == 'monthly':
                period = timedelta(days=30)
            else:
                period = timedelta(days=365)
            self.end_date = current_date + (period)
        super().save(*args, **kwargs)


class Recharge(models.Model):
    user = models.ForeignKey(PetSphereUser, on_delete=models.CASCADE)
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE)
    payment = models.ForeignKey(Payment, on_delete=models.CASCADE)
    start_date = models.DateTimeField(auto_now_add=True)
    balance = models.PositiveIntegerField(default=100)
    status = models.CharField(max_length=50)
    end_date = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.end_date and self.plan.plan_type == 'recharge':
            self.end_date = current_date + timedelta(days=60)
        super().save(*args, **kwargs)
