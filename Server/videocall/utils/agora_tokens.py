import time
from django.http import JsonResponse
from agora_token_builder import RtcTokenBuilder
from django.conf import settings

AGORA_APP_ID = settings.AGORA_APP_ID
AGORA_APP_CERTIFICATE = settings.AGORA_APP_CERTIFICATE
TOKEN_EXPIRATION = 3600


def get_agora_token(request):
    channel_name = request.GET.get("channelName")
    if not channel_name:
        return JsonResponse({"error": "Channel name required"}, status=400)

    current_time = int(time.time())
    token = RtcTokenBuilder.buildTokenWithUid(
        AGORA_APP_ID, AGORA_APP_CERTIFICATE, channel_name, 0,
        1, current_time + TOKEN_EXPIRATION
    )

    return JsonResponse({"token": token})
