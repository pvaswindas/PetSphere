from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import PetSphereUser
from user_profile.models import Profile
from .models import AccountSettings


@receiver(post_save, sender=PetSphereUser)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=PetSphereUser)
def create_account_settings(sender, instance, created, **kwargs):
    if created:
        AccountSettings.objects.create(user=instance)
