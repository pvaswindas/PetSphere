from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Pet, PetBreed
from .serializers import PetSerializer, PetBreedSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from common.storage import upload_to_s3_from_multipart


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
        try:
            data = request.data
            if not data:
                return Response({"error": "Proper data is needed"},
                                status=status.HTTP_400_BAD_REQUEST)
            name = data.get("name")
            description = data.get("description")
            icon = data.get("icon")

            errors = {}
            if not name:
                errors["name"] = ["This field is required"]
            if not description:
                errors["description"] = ["This field is required"]
            if not icon:
                errors["icon"] = ["This field is required"]

            if errors:
                return Response(
                    {
                        "success": False,
                        "message": "Validation error",
                        "errors": errors
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            icon_url = upload_to_s3_from_multipart(
                icon,
                s3_path="pets/icon",
                media_name=f"pets_icon{name}"
            )

            if not icon_url:
                return Response(
                    {
                        "success": False,
                        "message": "Failed to upload icon",
                        "error": "Image upload failed"
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            new_data = {
                "name": name,
                "description": description,
                "icon": icon_url
            }

            serializer = PetSerializer(data=new_data)

            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        "success": True,
                        "message": "Data saved successfully",
                        "data": serializer.data
                    },
                    status=status.HTTP_201_CREATED
                )

            return Response(
                {
                    "success": False,
                    "message": "Validation failed",
                    "errors": serializer.errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {
                    "success": False,
                    "message": "Server Error",
                    "error": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class PetBreedListView(APIView):

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAdminUser()]
        return [IsAuthenticated()]

    def get(self, request, pet_type=None):
        if pet_type:
            pet_breeds = PetBreed.objects.filter(pet_type__name=pet_type)
        else:
            pet_breeds = PetBreed.objects.all()

        if not pet_breeds:
            return Response({"detail": "No pet breed found"},
                            status=status.HTTP_204_NO_CONTENT)

        serializer = PetBreedSerializer(pet_breeds, many=True,)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def post(self, request):
        data = request.data
        if not data:
            return Response({"error": "Proper data is needed"},
                            status=status.HTTP_400_BAD_REQUEST)
        serializer = PetBreedSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
