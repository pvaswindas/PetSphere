from rest_framework import serializers
from .models import Pet, PetBreed
from urllib.parse import urljoin
from django.conf import settings


class PetSerializer(serializers.ModelSerializer):
    def get_absolute_url(self, url):
        if not url:
            return None
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(url)
        return urljoin(settings.BASE_URL, url)

    class Meta:
        model = Pet
        fields = '__all__'
        read_only_fields = ['slug']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.icon:
            representation['icon'] = self.get_absolute_url(
                instance.icon.url
            )
        return representation


class PetBreedSerializer(serializers.ModelSerializer):
    def get_absolute_url(self, url):
        if not url:
            return None
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(url)
        return urljoin(settings.BASE_URL, url)

    class Meta:
        model = PetBreed
        fields = '__all__'
        read_only_fields = ['slug']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.icon:
            representation['icon'] = self.get_absolute_url(
                instance.icon.url
            )
        return representation
