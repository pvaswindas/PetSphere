from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import PetSphereUser
from user_profile.models import Profile


@receiver(post_save, sender=PetSphereUser)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
