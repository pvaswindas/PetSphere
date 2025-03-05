import json
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import Message, Conversation
import jwt
import base64
import magic
import imghdr
import mimetypes
from django.core.files.base import ContentFile
from datetime import datetime
from django.conf import settings
from .serializers import MessageSerializer
from accounts.models import PetSphereUser


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """Handles a new WebSocket connection."""
        self.username = self.scope["url_route"]["kwargs"]["username"]
        self.current_user = await self.authenticate_user()

        if self.current_user is not None:
            self.scope["user"] = self.current_user
            self.room_name = self.get_room_name(
                self.current_user.username, self.username
            )
            self.conversation = await self.get_or_create_conversation()

            await self.channel_layer.group_add(
                self.room_name, self.channel_name
            )
            await self.accept()

        else:
            await self.close()

    async def disconnect(self, close_code):
        """Handles WebSocket disconnection."""
        if hasattr(self, 'room_name') and self.room_name:
            await self.channel_layer.group_discard(
                self.room_name, self.channel_name
            )

        if hasattr(self, 'conversation') and self.conversation:
            await self.delete_empty_conversation()

    async def receive(self, text_data):
        """Handles receiving messages and file uploads."""
        data = json.loads(text_data)
        message = data.get("message", "").strip()
        file_data = data.get("file", None)
        sender = self.scope["user"]
        receiver = await sync_to_async(
            PetSphereUser.objects.get
        )(username=self.username)

        # Save the message
        serialized_message = await self.save_message(
            sender, receiver, message, file_data
        )

        # Send the message to the group
        await self.channel_layer.group_send(
            self.room_name,
            {
                "type": "chat_message",
                "message": serialized_message,
                "sender": sender.username,
            }
        )

    async def authenticate_user(self):
        token = self.scope[
            'query_string'
            ].decode().split('=')[1] if '=' in self.scope[
                'query_string'].decode() else None
        if not token:
            await self.close()
            return None
        try:
            payload = jwt.decode(
                token, settings.SECRET_KEY, algorithms=["HS256"]
            )
            user = await database_sync_to_async(
                PetSphereUser.objects.get
            )(id=payload['user_id'])
            return user
        except jwt.ExpiredSignatureError:
            await self.close()
            return None
        except jwt.InvalidTokenError:
            await self.close()
            return None

    async def chat_message(self, event):
        """Send messages to WebSocket."""
        await self.send(text_data=json.dumps({
            "message": event["message"],
            "sender": event["sender"],
        }))

    @database_sync_to_async
    def save_message(self, sender, receiver, message, file_data):
        conversation = self.conversation
        saved_message = Message(
            sender=sender,
            receiver=receiver,
            conversation=conversation,
            content=message,
        )

        if file_data:
            try:
                if "," in file_data:
                    file_data = file_data.split(",")[1]

                file_bytes = base64.b64decode(file_data)

                mime = magic.Magic(mime=True)
                detected_mime = mime.from_buffer(file_bytes)

                file_extension = mimetypes.guess_extension(
                    detected_mime
                ) or ".bin"

                if not file_extension or file_extension == ".bin":
                    file_type = imghdr.what(None, h=file_bytes)
                    if file_type:
                        file_extension = f".{file_type}"

                timestamp = datetime.now().timestamp()
                file_name = f"chat_{timestamp}{file_extension}"

                saved_message.media_file.save(
                    file_name, ContentFile(file_bytes), save=False
                )
            except Exception as e:
                return e

        saved_message.save()

        conversation.last_message = message or ""
        conversation.last_message_timestamp = datetime.now()
        conversation.save()

        return MessageSerializer(saved_message).data

    @sync_to_async
    def get_or_create_conversation(self):
        """Get or create a conversation between two users."""
        current_user = self.current_user

        conversation = Conversation.objects.filter(
            users=current_user
        ).filter(users__username=self.username).first()

        if not conversation:
            conversation = Conversation.objects.create()
            conversation.users.add(
                current_user,
                PetSphereUser.objects.get(username=self.username)
            )

        return conversation

    @database_sync_to_async
    def delete_empty_conversation(self):
        """Deletes the conversation while disconnecting if no message exists"""
        if not self.conversation.messages.exists():
            self.conversation.delete()

    def get_room_name(self, user1, user2):
        """Generate room name."""
        return f"chat_{'_'.join(sorted([user1, user2]))}"
