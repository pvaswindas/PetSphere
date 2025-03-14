from django.http import JsonResponse
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.conf import settings
from user_profile.models import Profile
from accounts.models import PetSphereUser
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_notification(request):
    user = request.user
    message = "You have a new notification!"

    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"user_{user.id}",
        {"type": "send_notification", "message": message}
    )

    return JsonResponse({"status": "Notification sent"})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def initiate_call(request):
    try:
        callee_username = request.data.get("callee")
        caller = request.user

        print("CALLER : ", caller)
        print("CALLEE : ", callee_username)

        try:
            profile = Profile.objects.get(user=caller)
        except Profile.DoesNotExist:
            return JsonResponse(
                {"error": "Caller profile not found"}, status=400
            )

        caller_data = {
            "username": caller.username,
            "profile_picture": profile.profile_picture,
        }

        print("CALLER :", caller_data)

        callee = get_object_or_404(PetSphereUser, username=callee_username)

        print("CALLEE :", callee)

        print("DEBUG : BEFORE CHANNEL")
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"user_{callee.id}",
            {
                "type": "notify",
                "message": {
                    "type": "call_notification",
                    "caller": caller_data
                }
            }
        )

        return JsonResponse({
            "status": "Call initiated",
            "callee": callee_username
        })

    except Exception as e:
        print("ERROR : ", str(e))
        return JsonResponse({"error": str(e)}, status=500)
