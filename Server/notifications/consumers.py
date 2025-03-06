import json
import logging
import jwt
from django.conf import settings
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from accounts.models import PetSphereUser

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
            print(str(e))
            logger.error(f"Error in notification connect: {str(e)}", exc_info=True)
            await self.close()

    async def disconnect(self, close_code):
        try:
            logger.info(f"Notification WebSocket disconnection with code {close_code}")
            if hasattr(self, 'current_user') and self.current_user:
                logger.debug(f"Removing from notification group: {getattr(self, 'group_name', 'unknown')}")
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

    async def authenticate_user(self):
        try:
            query_string = self.scope.get('query_string', b'').decode('utf-8')
            logger.debug(f"Authenticating with query string: {query_string}")

            # More robust token extraction
            from urllib.parse import parse_qs
            query_params = parse_qs(query_string)
            token = query_params.get('token', [None])[0]
   
            if not token:
                logger.warning("No token found in query string")
                return None

            try:
                payload = jwt.decode(
                    token, settings.SECRET_KEY, algorithms=["HS256"]
                )
                logger.debug(f"Token decoded: user_id={payload.get('user_id', 'unknown')}")

                user = await sync_to_async(
                    PetSphereUser.objects.get
                )(id=payload["user_id"])
                logger.info(f"User authenticated: {user.username} (ID: {user.id})")
                return user
            except jwt.ExpiredSignatureError:
                logger.warning(f"Token expired")
                return None
            except jwt.InvalidTokenError:
                logger.warning(f"Invalid token")
                return None
            except Exception as e:
                logger.error(f"Authentication error: {str(e)}", exc_info=True)
                return None
        except Exception as e:
            print(str(e))
            logger.error(f"Unexpected error in authenticate_user: {str(e)}", exc_info=True)
            return None
