from django.http import JsonResponse
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from accounts.models import PetSphereUser
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def accept_call(request):
    try:
        caller_username = request.data.get("caller_username")
        callee = request.user

        # Get the caller user
        caller = get_object_or_404(PetSphereUser, username=caller_username)

        # Send acceptance notification through WebSocket
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"user_{caller.id}",
            {
                "type": "send_call_response",
                "response": "accepted",
                "callee_username": callee.username
            }
        )

        return JsonResponse({
            "status": "Call accepted",
            "caller": caller_username
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reject_call(request):
    try:
        caller_username = request.data.get("caller_username")
        callee = request.user

        # Get the caller user
        caller = get_object_or_404(PetSphereUser, username=caller_username)

        # Send rejection notification through WebSocket
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"user_{caller.id}",
            {
                "type": "send_call_response",
                "response": "rejected",
                "callee_username": callee.username
            }
        )

        return JsonResponse({
            "status": "Call rejected",
            "caller": caller_username
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
