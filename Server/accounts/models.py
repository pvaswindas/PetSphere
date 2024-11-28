from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.timezone import now
from datetime import timedelta


class PetSphereUser(AbstractUser):
    name = models.CharField(max_length=255)
    mobile_no = models.CharField(max_length=15, null=True, blank=True)
    profile_picture = models.ImageField(
        upload_to="profile_pics/",
        null=True,
        blank=True
        )
    updated_at = models.DateTimeField(auto_now=True)
    is_pending = models.BooleanField(default=False)
    is_suspended = models.BooleanField(default=False)

    first_name = None
    last_name = None

    def __str__(self):
        return self.username


class EmailOTP(models.Model):
    email = models.CharField(max_length=255)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    resend_count = models.BigIntegerField(default=6)

    def is_valid(self):
        expiry_duration = timedelta(minutes=10)
        return now() <= (self.created_at + expiry_duration)

    def can_resend(self):
        max_resends = 10
        return self.resend_count < max_resends

    def __str__(self):
        return f"OTP for {self.email}"
