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

    # Get all conversations where the user is a participant
    conversations = Conversation.objects.filter(
        users=user
    ).order_by('-timestamp')

    # Prepare the data for serialization
    conversation_data = []
    for conversation in conversations:
        # Get the latest message in the conversation
        latest_message = conversation.messages.order_by('-timestamp').first()
        unread_count = Message.objects.filter(
            conversation=conversation, receiver=user, read=False
        ).count()

        # Serialize the conversation with context (to access the user)
        serializer = ConversationSerializer(
            conversation, context={'user': user}
        )

        # Add the latest message and unread count to the serialized data
        data = serializer.data
        data['latest_message'] = latest_message.content \
            if latest_message else ''
        data['timestamp'] = latest_message.timestamp if latest_message else ''
        data['unread_count'] = unread_count

        conversation_data.append(data)

    return Response(conversation_data)


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
