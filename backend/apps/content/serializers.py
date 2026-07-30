from django.utils import timezone
from rest_framework import serializers
from .models import Post


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ("id", "title", "content", "status", "scheduled_at", "published_at", "created_at", "updated_at", "tone", "post_type", "source", "impressions", "likes", "comments", "shares")
        read_only_fields = ("id", "created_at", "updated_at", "published_at", "impressions", "likes", "comments", "shares")

    def validate(self, attrs):
        status = attrs.get("status", getattr(self.instance, "status", Post.Status.DRAFT))
        scheduled_at = attrs.get("scheduled_at", getattr(self.instance, "scheduled_at", None))
        if status == Post.Status.SCHEDULED and not scheduled_at:
            raise serializers.ValidationError({"scheduled_at": "Es obligatorio para una publicación programada."})
        if scheduled_at and scheduled_at <= timezone.now():
            raise serializers.ValidationError({"scheduled_at": "Debe ser una fecha futura."})
        return attrs

    def update(self, instance, validated_data):
        if "scheduled_at" in validated_data and instance.status == Post.Status.DRAFT and "status" not in validated_data:
            validated_data["status"] = Post.Status.SCHEDULED
        return super().update(instance, validated_data)
