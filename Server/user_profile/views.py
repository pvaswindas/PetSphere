from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from .models import Profile
from django.db.models import Q
from .serializers import ProfileSerializer


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        user = request.user
        try:
            profile = Profile.objects.get(user=user)
            serializer = ProfileSerializer(profile,
                                           context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Profile.DoesNotExist:
            return Response({'error': 'Profile not found'},
                            status=status.HTTP_404_NOT_FOUND)

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


class PeopleListView(APIView):
    def get(self, request):
        search_query = request.query_params.get('search', None)

        if search_query:
            users = Profile.objects.filter(
                Q(user__username__icontains=search_query) | Q(
                    user__name__icontains=search_query)
            )
        else:
            users = Profile.objects.all()

        serializer = ProfileSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)