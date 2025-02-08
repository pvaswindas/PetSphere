from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Conversation, Message
from accounts.models import PetSphereUser
from .serializers import ConversationSerializer, MessageSerializer
from petsphere.utils.common_utils import validate_authenticated_user


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_conversations(request):
    user = validate_authenticated_user(request)

    if isinstance(user, Response):
        return user

    conversations = Conversation.objects.filter(
        users=user
    ).order_by('-timestamp')

    serializer = ConversationSerializer(
        conversations, many=True, context={'user': request.user}
    )
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_messages(request, username):
    user = validate_authenticated_user(request)

    if isinstance(user, Response):
        return user

    try:
        other_user = PetSphereUser.objects.get(username=username)
    except PetSphereUser.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

    conversation = Conversation.objects.filter(
        users=user
    ).filter(users=other_user).first()

    if not conversation:
        return Response({'error': 'No conversation found'}, status=404)

    messages = Message.objects.filter(
        conversation=conversation
    ).order_by('timestamp')

    serializer = MessageSerializer(messages, many=True, context={'user': user})

    return Response(serializer.data)
