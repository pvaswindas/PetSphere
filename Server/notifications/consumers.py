import json
import jwt
from django.conf import settings
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from accounts.models import PetSphereUser


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.current_user = await self.authenticate_user()

        if self.current_user:
            self.group_name = f"user_{self.current_user.id}"

            if self.channel_layer:
                await self.channel_layer.group_add(
                    self.group_name, self.channel_name
                )

            await self.accept()
        else:
            await self.close()

    async def disconnect(self, close_code):
        if self.current_user:
            await self.channel_layer.group_discard(
                self.group_name, self.channel_name
            )

    async def receive(self, text_data):
        if text_data == "ping":
            await self.send(text_data=json.dumps({"type": "pong"}))

    async def send_call_notification(self, event):
        """Send call notification to the callee"""
        await self.send(text_data=json.dumps({
            "type": "call_notification",
            "caller": event["caller"]
        }))

    async def send_notification(self, event):
        """Handle generic notifications"""
        await self.send(text_data=json.dumps({
            "type": "notification",
            "message": event["message"]
        }))

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
