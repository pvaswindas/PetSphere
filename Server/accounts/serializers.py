from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import PetSphereUser
from .validators import validate_password


class PetSphereUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetSphereUser
        fields = [
            'id', 'username', 'email', 'name', 'mobile_no',
            'profile_picture', 'updated_at', 'is_pending',
            'is_suspended'
        ]
        read_only_fields = ['id', 'updated_at']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True,
                                     min_length=8)

    class Meta:
        model = PetSphereUser
        fields = ['email', 'password']

    def validate_password(self, value):
        return validate_password(value)

    def create(self, validated_data):
        return PetSphereUser.objects.create_user(**validated_data)


class ResetPasswordSerializer(serializers.Serializer):
    new_password = serializers.CharField(
        write_only=True,
        required=True,
        min_length=8,
        error_messages={
            'min_length': 'Password must be at least 8 characters long.'
        }
    )

    def validate_new_password(self, value):
        return validate_password(value)

    def save(self, user):
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True, required=True)
    new_password = serializers.CharField(write_only=True, required=True)

    def validate_new_password(self, value):
        try:
            validate_password(value)
        except Exception as e:
            raise serializers.ValidationError(str(e))
        return value

    def validate(self, data):
        user = self.context['request'].user
        old_password = data.get('old_password')
        new_password = data.get('new_password')

        if not user.check_password(old_password):
            raise serializers.ValidationError({
                'old_password': 'Old password is incorrect'})
        if old_password == new_password:
            raise serializers.ValidationError({
                'new_password': 'New password is same as the old password.'
            })
        return data

    def save(self, user):
        user = self.context['request'].user
        new_password = self.validated_data['new_password']
        user.set_password(new_password)
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(username=data['username'],
                            password=data['password'])
        if not user:
            raise serializers.ValidationError("Invalid username or password")
        return user
