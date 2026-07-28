from rest_framework import serializers
from .models import Idea


class IdeaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Idea
        fields = ("id", "title", "description", "category", "tags", "is_saved", "created_at")
        read_only_fields = ("id", "created_at")

    def validate_tags(self, value):
        if not isinstance(value, list) or len(value) > 10 or any(not isinstance(tag, str) or not tag.strip() or len(tag) > 30 for tag in value):
            raise serializers.ValidationError("Las etiquetas no son válidas.")
        return list(dict.fromkeys(tag.strip() for tag in value))
