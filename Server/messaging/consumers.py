import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import Message, Conversation
from accounts.models import PetSphereUser


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """Handles a new Websocket connection."""
        self.username = self.scope["url_route"]["kwargs"]["username"]
        self.current_user = self.scope["user"].username
        chat_room = self.get_room_name(self.current_user, self.username)
        self.room_name = f"chat_{chat_room}"

        # Create or get the conversation between users
        self.conversation = await self.get_or_create_conversation()

        # Join the conversation group
        await self.channel_layer.group_add(self.room_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        """Handles a Websocket disconnection."""
        await self.channel_layer.group_discard(
            self.room_name, self.channel_name
        )

    async def receive(self, text_data):
        """Handles incoming messages from the client."""
        data = json.loads(text_data)
        message = data["message"]
        sender = self.scope["user"]

        receiver = await sync_to_async(
            PetSphereUser.objects.get
        )(username=self.username)

        # Save the message in the conversation
        await self.save_message(sender, receiver, message)

        # Send the message to the group
        await self.channel_layer.group_send(
            self.room_name,
            {
                "type": "chat_message",
                "message": message,
                "sender": sender.username,
            }
        )

    async def chat_message(self, event):
        """Handles sending messages to the client."""
        await self.send(text_data=json.dumps({
            "message": event["message"],
            "sender": event["sender"],
        }))

    @sync_to_async
    def save_message(self, sender, receiver, message):
        """Stores messages in the database."""
        # Ensure conversation is created before saving message
        conversation = self.get_or_create_conversation(sender, receiver)
        Message.objects.create(
            sender=sender,
            receiver=receiver,
            conversation=conversation,
            content=message
        )

    @sync_to_async
    def get_or_create_conversation(self, sender, receiver):
        """Returns an existing conversation or creates a new one."""
        conversation, created = Conversation.objects.get_or_create(
            users__in=[sender, receiver]
        )
        return conversation

    def get_room_name(self, user1, user2):
        """Returns the room name for a given pair of users."""
        return "_".join(sorted([user1, user2]))
