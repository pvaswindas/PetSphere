import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import Message, Conversation
from accounts.models import PetSphereUser


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """Handles a new WebSocket connection."""
        self.username = self.scope["url_route"]["kwargs"]["username"]
        self.current_user = self.scope["user"]

        if not self.current_user.is_authenticated:
            await self.close()
            return

        self.room_name = self.get_room_name(
            self.current_user.username, self.username
        )

        self.conversation = await sync_to_async(
            self.get_or_create_conversation
        )()

        # Join the conversation group
        await self.channel_layer.group_add(self.room_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        """Handles WebSocket disconnection."""
        await self.channel_layer.group_discard(
            self.room_name, self.channel_name
        )

    async def receive(self, text_data):
        """Handles incoming messages."""
        data = json.loads(text_data)
        message = data["message"]
        sender = self.scope["user"]

        receiver = await sync_to_async(
            PetSphereUser.objects.get
        )(username=self.username)

        # Save the message
        saved_message = await self.save_message(sender, receiver, message)

        # Send the message to the group
        await self.channel_layer.group_send(
            self.room_name,
            {
                "type": "chat_message",
                "message": saved_message.content,
                "sender": sender.username,
            }
        )

    async def chat_message(self, event):
        """Send messages to WebSocket."""
        await self.send(text_data=json.dumps({
            "message": event["message"],
            "sender": event["sender"],
        }))

    @sync_to_async
    def save_message(self, sender, receiver, message):
        """Store messages in the database."""
        conversation = self.conversation
        return Message.objects.create(
            sender=sender,
            receiver=receiver,
            conversation=conversation,
            content=message
        )

    @sync_to_async
    def get_or_create_conversation(self):
        """Get or create a conversation between two users."""
        conversation = Conversation.objects.filter(
            users=self.current_user
        ).filter(users__username=self.username).first()

        if not conversation:
            conversation = Conversation.objects.create()
            conversation.users.add(
                self.current_user,
                PetSphereUser.objects.get(username=self.username)
            )

        return conversation

    def get_room_name(self, user1, user2):
        """Generate room name."""
        return f"chat_{'_'.join(sorted([user1, user2]))}"
