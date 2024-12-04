from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from .models import Profile
from .serializers import ProfileSerializer


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        user_id = request.data.get('user_id')
        if user_id:
            try:
                profile = Profile.objects.get(user__id=user_id)
                serializer = ProfileSerializer(profile)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Profile.DoesNotExist:
                return Response({'error': 'Profile not found'},
                                status=status.HTTP_404_NOT_FOUND)
        else:
            profile = Profile.objects.filter(user=request.user).first()
            if not profile:
                return Response({'error': 'Profile not found'},
                                status=status.HTTP_404_NOT_FOUND)
            serializer = ProfileSerializer(profile)
            return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request):
        try:
            profile = Profile.objects.get(user=request.user)
        except Profile.DoesNotExist:
            return Response({'error': 'Profile not found'},
                            status=status.HTTP_404_NOT_FOUND)

        serializer = ProfileSerializer(
            profile, data=request.data, partial=True,
            context={'request': request})

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
