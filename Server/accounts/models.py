from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.timezone import now


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
    receive_message = models.BooleanField(default=True)
    push_notification = models.BooleanField(default=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    def delete(self):
        """Soft delete the account by setting the deleted_at field."""
        self.deleted_at = now()
        self.save()

    def restore(self):
        """Restore a soft-deleted account."""
        self.deleted_at = None
        self.save()

    @property
    def is_active(self):
        """Check if the account is active."""
        return self.deleted_at is None
