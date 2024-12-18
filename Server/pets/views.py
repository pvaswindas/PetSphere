from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Pet, PetBreed
from .serializers import PetSerializer, PetBreedSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated, IsAdminUser


class PetListView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAdminUser()]
        return [IsAuthenticated()]

    def get(self, request):
        pets = Pet.objects.all()
        if not pets:
            return Response({"detail": "No pets found"},
                            status=status.HTTP_204_NO_CONTENT)
        serializer = PetSerializer(pets, many=True,
                                   context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data
        serializer = PetSerializer(data=data,
                                   context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PetBreedListView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAdminUser()]
        return [IsAuthenticated()]

    def get(self, request):
        petbreeds = PetBreed.objects.all()
        if not petbreeds:
            return Response({"detail": "No pet breed found"},
                            status=status.HTTP_204_NO_CONTENT)
        serializer = PetBreedSerializer(petbreeds, many=True,
                                        context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
