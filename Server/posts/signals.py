from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.text import slugify
from .models import Post


@receiver(post_save, sender=Post)
def generate_slug(sender, instance, created, **kwargs):
    if created:
        trimmed_content = ''.join(
            instance.content.split()) if instance.content else ''
        len_content = len(trimmed_content)
        if instance.content is None or len_content == 0:
            base_slug = (
                f"{instance.id}-"
                f"{instance.created_at.strftime('%H%M%S')}"
            )
        else:
            extra_characters = trimmed_content[
                :max(0, 7 - len(str(instance.id)))]
            base_slug = (
                f"{instance.id}-{extra_characters}-"
                f"{instance.created_at.strftime('%H%M%S')}"
            )

        slug = slugify(base_slug)

        original_slug = slug
        counter = 1
        while Post.objects.filter(slug=slug).exists():
            slug = f"{original_slug}-{counter}"
            counter += 1

        instance.slug = slug
        instance.save(update_fields=['slug'])
