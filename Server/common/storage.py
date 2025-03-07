import base64
import magic
import imghdr
import boto3
import uuid
import mimetypes
import io
from datetime import datetime
from django.conf import settings
from botocore.exceptions import NoCredentialsError


def upload_to_s3(file_base64, s3_path="common", media_name="common"):
    """
    Uploads a base64-encoded file to an S3 bucket.

    :param file_base64: Base64-encoded file data
    :param s3_path: Folder in S3 where the file should be stored
    :return: S3 file URL or None if upload fails
    """
    try:
        # Decode base64 file
        file_bytes = base64.b64decode(file_base64)

        # Detect MIME type
        mime = magic.Magic(mime=True)
        detected_mime = mime.from_buffer(file_bytes)

        # Guess extension
        file_extension = mimetypes.guess_extension(detected_mime) or ""
        if not file_extension or file_extension == ".bin":
            file_type = imghdr.what(None, h=file_bytes)
            if file_type:
                file_extension = f".{file_type}"

        # Generate a unique file name
        timestamp = int(datetime.now().timestamp())
        file_name = f"{media_name}_{timestamp}{file_extension}"
        media_key = f"{s3_path}/{uuid.uuid4()}-{file_name}"

        # Convert bytes to a file-like object
        file_obj = io.BytesIO(file_bytes)

        # Initialize S3 client
        s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        )

        # Upload to S3
        s3_client.upload_fileobj(
            file_obj,
            settings.AWS_STORAGE_BUCKET_NAME,
            media_key,
        )

        return f"https://{settings.AWS_S3_CUSTOM_DOMAIN}/{media_key}"

    except NoCredentialsError:
        print("AWS credentials not found")
        return None
    except Exception as e:
        print(f"Error uploading file: {e}")
        return None
