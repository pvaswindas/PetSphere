from django.contrib.auth.models import AbstractUser
from django.db import models


class PetSphereUser(AbstractUser):
    name = models.CharField(max_length=255)
    mobile_no = models.CharField(max_length=15, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_pending = models.BooleanField(default=False)
    is_suspended = models.BooleanField(default=False)

    first_name = None
    last_name = None

    def __str__(self):
        return self.username


class AccountSettings(models.Model):
    user = models.OneToOneField(PetSphereUser, on_delete=models.CASCADE,
                                related_name='account_settings')
    is_private = models.BooleanField(default=False)
    receive_message = models.BooleanField(default=True)
    push_notification = models.BooleanField(default=True)
    is_deactivate = models.BooleanField(default=False)
