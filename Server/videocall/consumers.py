import json
from django.conf import settings
import jwt
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from accounts.models import PetSphereUser


class VideoCallConsumer(AsyncWebsocketConsumer):
    active_calls = {}

    async def connect(self):
        self.username = self.scope["url_route"]["kwargs"]["username"]
        self.current_user = await self.authenticate_user()

        if self.current_user:
            self.scope["user"] = self.current_user
            self.room_name = self.get_room_name(
                self.current_user.username, self.username
            )

            await self.channel_layer.group_add(
                self.room_name, self.channel_name
            )
            await self.accept()

            # Notify about call status
            if self.room_name in self.active_calls:
                await self.send(
                    text_data=json.dumps(
                        {"type": "call-status", "status": "ongoing"}
                    )
                )
            else:
                await self.send(
                    text_data=json.dumps(
                        {"type": "call-status", "status": "available"}
                    )
                )
        else:
            await self.close()

    async def disconnect(self, close_code):
        """Handles WebSocket disconnection."""
        if hasattr(self, 'room_name'):
            await self.channel_layer.group_discard(
                self.room_name, self.channel_name
            )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get("type")

        if message_type == "offer":
            self.active_calls[self.room_name] = True

        elif message_type == "call-ended":
            if self.room_name in self.active_calls:
                del self.active_calls[self.room_name]

        elif message_type == "accept-call":
            """User accepted the call"""
            await self.channel_layer.group_send(
                self.room_name,
                {
                    "type": "call_accepted",
                    "caller": self.scope["user"].username,
                }
            )

        elif message_type == "reject-call":
            """User rejected the call"""
            await self.channel_layer.group_send(
                self.room_name,
                {
                    "type": "call_rejected",
                    "caller": self.scope["user"].username,
                }
            )

        await self.channel_layer.group_send(
            self.room_name,
            {
                "type": "video_call_message",
                "message": data,
                "sender": self.scope["user"].username,
            }
        )

    async def call_accepted(self, event):
        """Notify caller that the call was accepted."""
        await self.send(
            text_data=json.dumps({
                "type": "call-accepted",
                "caller": event["caller"]
            })
        )

    async def call_rejected(self, event):
        """Notify caller that the call was rejected."""
        await self.send(
            text_data=json.dumps({
                "type": "call-rejected",
                "caller": event["caller"]
            })
        )

    async def end_video_call(self, event):
        """Notify both users that the call has ended."""
        await self.send(text_data=json.dumps({"type": "call-ended"}))
        await self.close()

    async def video_call_message(self, event):
        """Sends WebRTC signaling messages to the other user."""
        if event["sender"] != self.scope["user"].username:
            await self.send(text_data=json.dumps(event["message"]))

    async def authenticate_user(self):
        """Authenticates user from query token."""
        token = self.scope[
            "query_string"
        ].decode().split("=")[1] if "=" in self.scope[
            "query_string"
        ].decode() else None
        if not token:
            return None

        try:
            payload = jwt.decode(
                token, settings.SECRET_KEY, algorithms=["HS256"]
            )
            user = await sync_to_async(
                PetSphereUser.objects.get
            )(id=payload["user_id"])
            return user
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None

    def get_room_name(self, user1, user2):
        """Generate unique room name for the video call."""
        return f"video_call_{'_'.join(sorted([user1, user2]))}"
