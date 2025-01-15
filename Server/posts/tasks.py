from celery import shared_task
from datetime import timedelta
from django.utils import timezone
from .models import PetListingImageTemp
import os


@shared_task
def delete_old_images():
    now = timezone.now()
    threshold_time = now - timedelta(hours=1)

    old_images = PetListingImageTemp.objects.filter(
        created_at__lt=threshold_time
    )

    for image_obj in old_images:
        if image_obj.image:
            if os.path.isfile(image_obj.image.path):
                os.remove(image_obj.image.path)

        image_obj.delete()

    return f"Deleted {old_images.count()} old images."


@shared_task
def check_and_trigger_delete():
    if PetListingImageTemp.objects.exists():
        delete_old_images.delay()
