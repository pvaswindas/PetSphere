from django.db import models
from accounts.models import PetSphereUser


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
    sender = models.ForeignKey(
        PetSphereUser, on_delete=models.CASCADE, related_name="sent_messages"
    )
    receiver = models.ForeignKey(
        PetSphereUser, on_delete=models.CASCADE,
        related_name="received_messages"
    )
    conversation = models.ForeignKey(
        Conversation, on_delete=models.CASCADE, related_name="messages"
    )
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    # Message visibility tracking
    sender_deleted = models.BooleanField(default=False)
    receiver_deleted = models.BooleanField(default=False)
    fully_deleted = models.BooleanField(default=False)

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
