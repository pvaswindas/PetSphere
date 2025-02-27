import jwt
from django.conf import settings
from accounts.models import PetSphereUser


def authenticate_user(scope):
    """Authenticates the user from the WebSocket query string."""
    token = scope[
        "query_string"
    ].decode().split("=")[1] if "=" in scope["query_string"].decode() else None
    if not token:
        return None

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        return PetSphereUser.objects.get(id=payload["user_id"])
    except (
        jwt.ExpiredSignatureError,
        jwt.InvalidTokenError,
        PetSphereUser.DoesNotExist
    ):
        return None
