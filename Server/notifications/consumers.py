import json
import logging
import jwt
from channels.db import database_sync_to_async
from urllib.parse import parse_qs
from django.contrib.auth import get_user_model
from django.conf import settings
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from accounts.models import PetSphereUser
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken

# Set up logger
logger = logging.getLogger('websockets')


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            logger.debug(f"Notification WebSocket connection attempt: {self.scope}")

            # Log query string
            query_string = self.scope.get('query_string', b'').decode('utf-8')
            logger.debug(f"Notification WebSocket query string: {query_string}")

            self.current_user = await self.authenticate_user()

            if self.current_user:
                logger.info(f"Notification WebSocket authenticated: user_id={self.current_user.id}, username={self.current_user.username}")
                self.group_name = f"user_{self.current_user.id}"
                logger.debug(f"Notification group name: {self.group_name}")

                if self.channel_layer:
                    await self.channel_layer.group_add(
                        self.group_name, self.channel_name
                    )
                    logger.info(f"Added to notification group: {self.group_name}")

                await self.accept()
                logger.info(f"Notification WebSocket connection accepted for user_id={self.current_user.id}")
            else:
                logger.warning("Notification WebSocket authentication failed")
                await self.close()
        except Exception as e:
            logger.error(f"Error in notification connect: {str(e)}", exc_info=True)
            await self.close()

    async def disconnect(self, close_code):
        try:
            logger.info(f"Notification WebSocket disconnection with code {close_code}")
            if hasattr(self, 'current_user') and self.current_user and hasattr(self, 'group_name'):
                logger.debug(f"Removing from notification group: {self.group_name}")
                await self.channel_layer.group_discard(
                    self.group_name, self.channel_name
                )
        except Exception as e:
            logger.error(f"Error in notification disconnect: {str(e)}", exc_info=True)

    async def receive(self, text_data):
        try:
            logger.debug(f"Notification received data: {text_data}")
            if text_data == "ping":
                logger.debug("Ping received, sending pong")
                await self.send(text_data=json.dumps({"type": "pong"}))
        except Exception as e:
            logger.error(f"Error in notification receive: {str(e)}", exc_info=True)

    async def notify(self, event):
        """
        Handle notifications sent to the group
        """
        try:
            message = event.get('message', {})
            logger.debug(f"Sending notification: {message}")
            await self.send(text_data=json.dumps(message))
        except Exception as e:
            logger.error(f"Error sending notification: {str(e)}", exc_info=True)

    async def authenticate_user(self):
        token = self.scope['query_string'].decode().split('=')[1]
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user = await database_sync_to_async(get_user_model().objects.get)(id=payload['user_id'])

            is_authorized = await self.is_user_allowed(user)
            if not is_authorized:
                logger.warning(f"Unauthorized user {user.email} tried to access room {self.room_id}")
                await self.close()
                return None
            return user
        except jwt.ExpiredSignatureError:
            await self.close()
            return None
        except jwt.InvalidTokenError:
            await self.close()
            return None
