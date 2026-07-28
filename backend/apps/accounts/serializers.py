import re

from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "name", "avatar_url", "profession", "technologies", "goal", "tone", "language", "publish_frequency", "onboarding_completed", "date_joined")
        read_only_fields = ("id", "email", "date_joined")

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["created_at"] = data.pop("date_joined")
        return data

    def validate_technologies(self, value):
        if not isinstance(value, list) or len(value) > 30 or any(not isinstance(item, str) or not item.strip() or len(item) > 50 for item in value):
            raise serializers.ValidationError("Tecnologías inválidas.")
        return list(dict.fromkeys(item.strip() for item in value))

    def validate_name(self, value):
        value = value.strip()
        if len(value) < 2:
            raise serializers.ValidationError("El nombre debe tener al menos 2 caracteres.")
        return value


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, trim_whitespace=False)

    class Meta:
        model = User
        fields = ("name", "email", "password")

    def validate_password(self, value):
        validate_password(value)
        if not re.search(r"[A-Z]", value):
            raise serializers.ValidationError("La contraseña debe incluir al menos una mayúscula.")
        if not re.search(r"\d", value):
            raise serializers.ValidationError("La contraseña debe incluir al menos un número.")
        if not re.search(r"[^A-Za-z0-9]", value):
            raise serializers.ValidationError("La contraseña debe incluir al menos un carácter especial.")
        return value

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
