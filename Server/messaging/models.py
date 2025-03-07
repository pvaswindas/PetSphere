from django.db import models
from accounts.models import PetSphereUser
from storages.backends.s3boto3 import S3Boto3Storage


class Conversation(models.Model):
    name = models.CharField(max_length=255, null=True, blank=True)
    users = models.ManyToManyField(PetSphereUser, related_name="conversations")
    timestamp = models.DateTimeField(auto_now_add=True)
    last_message = models.TextField(null=True, blank=True)
    last_message_timestamp = models.DateTimeField(null=True, blank=True)

    def get_messages(self):
        """Returns all messages for this conversation."""
        return self.message_set.all()

    def get_other_user(self, user):
        """Returns the other user in the conversation."""
        users = self.users.exclude(id=user.id)
        return users.first() if users.exists() else None

    def __str__(self):
        """Returns a string representation of the conversation."""
        users = [user.username for user in self.users.all()]
        return f"Conversation between {', '.join(users)}"


class Message(models.Model):
    TEXT = "text"
    IMAGE = "image"
    VIDEO = "video"
    MIXED = "mixed"

    MESSAGE_TYPES = [
        (TEXT, "Text"),
        (IMAGE, "Image"),
        (VIDEO, "Video"),
        (MIXED, "Mixed"),
    ]

    sender = models.ForeignKey(
        PetSphereUser, on_delete=models.CASCADE, related_name="sent_messages"
    )
    receiver = models.ForeignKey(
        PetSphereUser, on_delete=models.CASCADE,
        related_name="received_messages"
    )
    conversation = models.ForeignKey(
        "Conversation", on_delete=models.CASCADE, related_name="messages"
    )

    content = models.TextField(null=True, blank=True)
    media_url = models.URLField(
        null=True,
        blank=True,
    )
    message_type = models.CharField(
        max_length=10, choices=MESSAGE_TYPES, default=TEXT
    )

    timestamp = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    sender_deleted = models.BooleanField(default=False)
    receiver_deleted = models.BooleanField(default=False)
    fully_deleted = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        """Automatically determine message type based on content and media."""
        if self.content and self.media_url:
            self.message_type = self.MIXED
        elif self.media_url:
            if self.media_url.name.lower().endswith(
                (".mp4", ".mkv", ".avi", ".mov")
            ):
                self.message_type = self.VIDEO
            else:
                self.message_type = self.IMAGE
        else:
            self.message_type = self.TEXT
        try:
            old_instance = Message.objects.get(pk=self.pk)

            if (
                old_instance.media_url and
                old_instance.media_url.name != self.icon.name
            ):
                old_instance.media_url.delete(save=False)
        except Message.DoesNotExist:
            pass

        super().save(*args, **kwargs)

    # def delete(self, *args, **kwargs):
    #     if self.media_url:
    #         self.media_url.delete(save=False)

    #     super().delete(*args, **kwargs)

    def delete_for_user(self, user):
        """Marks the message as deleted for a specific user."""
        if user == self.sender:
            self.sender_deleted = True
        elif user == self.receiver:
            self.receiver_deleted = True
        self.save()

    def delete_for_both(self, user):
        """Marks the message as fully deleted."""
        if user == self.sender:
            self.fully_deleted = True
            self.save()

    def __str__(self):
        return f"From {self.sender.username} to {self.receiver.username}"
