from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Follower


@receiver(post_save, sender=Follower)
def increase_follow_count(sender, instance, created, **kwargs):
    """Increase follow and follower count when a follow is created."""
    if created:
        instance.follower.profile.following_count += 1
        instance.follower.profile.save()

        instance.following.profile.follower_count += 1
        instance.following.profile.save()


@receiver(post_delete, sender=Follower)
def decrease_follow_count(sender, instance, **kwargs):
    """Decrease follow and follower count when a follow is deleted."""
    instance.follower.profile.following_count = max(
        0, instance.follower.profile.following_count - 1
    )
    instance.follower.profile.save()

    instance.following.profile.follower_count = max(
        0, instance.following.profile.follower_count - 1
    )
    instance.following.profile.save()
