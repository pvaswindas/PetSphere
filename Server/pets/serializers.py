from rest_framework import serializers
from .models import Pet, PetBreed


class PetSerializer(serializers.ModelSerializer):

    class Meta:
        model = Pet
        fields = '__all__'
        read_only_fields = ['slug']


class PetBreedSerializer(serializers.ModelSerializer):

    class Meta:
        model = PetBreed
        fields = '__all__'
        read_only_fields = ['slug']
