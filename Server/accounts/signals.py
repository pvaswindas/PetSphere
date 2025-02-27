from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import PetSphereUser
from user_profile.models import Profile
from .models import AccountSettings
from rest_framework_simplejwt.tokens import OutstandingToken
from django.contrib.sessions.models import Session
from django.utils.timezone import now


@receiver(post_save, sender=PetSphereUser)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=PetSphereUser)
def create_account_settings(sender, instance, created, **kwargs):
    if created:
        AccountSettings.objects.create(user=instance)


@receiver(post_save, sender=PetSphereUser)
def suspend_user(sender, instance, **kwargs):
    """
    If the user's account is suspended, log them out and remove their tokens.
    """
    if instance.is_suspended or not instance.is_active:
        try:
            tokens = OutstandingToken.objects.filter(user=instance)
            tokens.delete()
        except Exception as e:
            print(f"Error deleting JWT tokens: {e}")

        sessions = Session.objects.filter(expire_date__gte=now())
        for session in sessions:
            data = session.get_decoded()
            if str(instance.id) == str(data.get('_auth_user_id')):
                session.delete()
