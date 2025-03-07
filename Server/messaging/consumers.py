import json
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import Message, Conversation
import jwt
import base64
import magic
import imghdr
import boto3
import uuid
import io  # Added missing import
import mimetypes
import logging
from urllib.parse import parse_qs
from django.core.files.base import ContentFile
from datetime import datetime
from django.conf import settings
from .serializers import MessageSerializer
from accounts.models import PetSphereUser

# Set up logger
logger = logging.getLogger('websockets')


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """Handles a new WebSocket connection."""
        try:
            self.username = self.scope["url_route"]["kwargs"]["username"]

            # Log query string
            query_string = self.scope.get('query_string', b'').decode('utf-8')
            logger.debug(f"Chat WebSocket query string: {query_string}")

            self.current_user = await self.authenticate_user()

            if self.current_user is not None:
                self.scope["user"] = self.current_user
                self.room_name = self.get_room_name(
                    self.current_user.username, self.username
                )
                logger.debug(f"Chat room name: {self.room_name}")

                self.conversation = await self.get_or_create_conversation()

                await self.channel_layer.group_add(
                    self.room_name, self.channel_name
                )
                logger.info(f"Added to chat group: {self.room_name}")

                await self.accept()
            else:
                logger.warning("Chat WebSocket authentication failed")
                await self.close()
        except Exception as e:
            logger.error(f"Error in chat connect: {str(e)}", exc_info=True)
            await self.close()

    async def disconnect(self, close_code):
        """Handles WebSocket disconnection."""
        try:
            logger.info(f"Chat WebSocket disconnection with code {close_code}")
            if hasattr(self, 'room_name') and self.room_name:
                logger.debug(f"Removing from chat group: {self.room_name}")
                await self.channel_layer.group_discard(
                    self.room_name, self.channel_name
                )

            if hasattr(self, 'conversation') and self.conversation:
                await self.delete_empty_conversation()
        except Exception as e:
            logger.error(f"Error in chat disconnect: {str(e)}", exc_info=True)

    async def receive(self, text_data):
        """Handles receiving messages and file uploads."""
        try:
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
        except Exception as e:
            logger.error(f"Error in chat receive: {str(e)}", exc_info=True)

    async def authenticate_user(self):
        """Authenticate user using JWT token from query string."""
        try:
            # Extract token from query string
            query_string = self.scope['query_string'].decode()
            params = parse_qs(query_string)
            token = params.get('token', [''])[0]

            if not token:
                logger.warning("No token in Chat WebSocket connection")
                return None

            # Decode and verify JWT token
            payload = jwt.decode(
                token, settings.SECRET_KEY, algorithms=["HS256"]
            )
            user_id = payload.get('user_id')

            if not user_id:
                logger.warning("Invalid token payload - no user_id")
                return None

            # Get user from database
            user = await database_sync_to_async(
                PetSphereUser.objects.get
            )(id=user_id)
            logger.info(f"User {user.id} authenticated successfully")
            return user

        except jwt.ExpiredSignatureError:
            logger.warning("Token expired")
            return None
        except jwt.InvalidTokenError:
            logger.warning("Invalid token")
            return None
        except PetSphereUser.DoesNotExist:
            logger.warning(
                f"User with id "
                f"{user_id if 'user_id' in locals() else 'unknown'} "
                "not found"
            )
            return None
        except Exception as e:
            logger.error(f"Authentication error: {str(e)}")
            return None

    async def chat_message(self, event):
        """Send messages to WebSocket."""
        try:
            # Only send the message once and don't log redundantly
            await self.send(text_data=json.dumps({
                "message": event["message"],
                "sender": event["sender"],
            }))
            # Log once per message, not multiple times
            logger.debug("Message forwarded to client")
        except Exception as e:
            logger.error(
                f"Error sending chat message: {str(e)}", exc_info=True
            )

    @database_sync_to_async
    def save_message(self, sender, receiver, message, file_data):
        """Save message and handle file uploads."""
        try:
            conversation = self.conversation
            if not message or len(message) == 0 or (len(message) == 0 and not file_data):
                return None
            print(message)
            saved_message = Message(
                sender=sender,
                receiver=receiver,
                conversation=conversation,
                content=message,
            )

            if file_data:
                try:
                    # Process file data if it's a base64 string
                    if isinstance(file_data, str):
                        if "," in file_data:
                            file_data = file_data.split(",")[1]

                        file_bytes = base64.b64decode(file_data)

                        # Detect mimetype and determine extension
                        mime = magic.Magic(mime=True)
                        detected_mime = mime.from_buffer(file_bytes)

                        file_extension = mimetypes.guess_extension(detected_mime) or ".bin"

                        if not file_extension or file_extension == ".bin":
                            file_type = imghdr.what(None, h=file_bytes)
                            if file_type:
                                file_extension = f".{file_type}"

                        # Generate file name with timestamp and proper extension
                        timestamp = datetime.now().timestamp()
                        file_name = f"chat_{timestamp}{file_extension}"

                        # Generate a unique media key
                        media_key = f'messages/{uuid.uuid4()}-{file_name}'

                        # Initialize the S3 client
                        s3_client = boto3.client(
                            's3',
                            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                            region_name=settings.AWS_S3_REGION_NAME
                        )

                        try:
                            # Create a BytesIO object to act as a file-like object
                            file_obj = io.BytesIO(file_bytes)

                            # Upload the file-like object
                            s3_client.upload_fileobj(
                                file_obj,
                                settings.AWS_STORAGE_BUCKET_NAME,
                                media_key,
                                ExtraArgs={'ACL': 'public-read'}
                            )
                            media_url = (
                                f'https://{settings.AWS_S3_CUSTOM_DOMAIN}/'
                                f'{media_key}'
                            )
                        except Exception as e:
                            logger.error(f"S3 CONNECTION ERROR: {str(e)}")
                            return {"error": f"File upload failed: {str(e)}"}

                        # Set the media_url directly
                        saved_message.media_url = media_url
                    else:
                        # Handle if file_data is already a file-like object
                        file_name = getattr(file_data, 'name', f"file_{uuid.uuid4()}")
                        media_key = f'messages/{uuid.uuid4()}-{file_name}'

                        s3_client = boto3.client(
                            's3',
                            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                            region_name=settings.AWS_S3_REGION_NAME
                        )

                        s3_client.upload_fileobj(
                            file_data,
                            settings.AWS_STORAGE_BUCKET_NAME,
                            media_key,
                            ExtraArgs={'ACL': 'public-read'}
                        )
                        media_url = (
                            f'https://{settings.AWS_S3_CUSTOM_DOMAIN}/'
                            f'{media_key}'
                        )
                        saved_message.media_url = media_url

                except Exception as e:
                    logger.error(
                        f"Error processing file data: {str(e)}", exc_info=True
                    )
                    return {"error": f"File upload failed: {str(e)}"}

            saved_message.save()

            conversation.last_message = message or ""
            conversation.last_message_timestamp = datetime.now()
            conversation.save()

            return MessageSerializer(saved_message).data
        except Exception as e:
            logger.error(f"Error saving message: {str(e)}", exc_info=True)
            return {"error": str(e)}

    @sync_to_async
    def get_or_create_conversation(self):
        """Get or create a conversation between two users."""
        try:
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
        except Exception as e:
            logger.error(
                f"Error in get_or_create_conversation: {str(e)}", exc_info=True
            )
            raise

    @database_sync_to_async
    def delete_empty_conversation(self):
        """Deletes the conversation while disconnecting if no message exists"""
        try:
            if not self.conversation.messages.exists():
                self.conversation.delete()
        except Exception as e:
            logger.error(
                f"Error deleting empty conversation: {str(e)}", exc_info=True
            )

    def get_room_name(self, user1, user2):
        """Generate room name."""
        room_name = f"chat_{'_'.join(sorted([user1, user2]))}"
        logger.debug(f"Generated room name: {room_name}")
        return room_name
