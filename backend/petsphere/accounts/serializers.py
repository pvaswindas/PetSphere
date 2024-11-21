from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import PetSphereUser, Profile


class PetSphereUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetSphereUser
        fields = [
            'id', 'username', 'email', 'name', 'mobile_no',
            'profile_picture', 'updated_at', 'is_pending',
            'is_suspended'
        ]
        read_only_fields = ['id', 'updated_at']


class ProfileSerializer(serializers.ModelSerializer):
    user = PetSphereUserSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = [
            'id', 'user', 'bio', 'is_private', 'push_notification',
            'follower_count', 'following_count'
        ]
        read_only_fields = ['id', 'following_count', 'following_count']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True,
                                     min_length=8)

    class Meta:
        model = PetSphereUser
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        return PetSphereUser.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(username=data['username'],
                            password=data['password'])
        if not user:
            raise serializers.ValidationError("Invalid username or password")
        return user
