from rest_framework import serializers
from apps.content.models import Post
from apps.content.serializers import PostSerializer


class GeneratePostSerializer(serializers.Serializer):
    mode = serializers.ChoiceField(choices=("idea", "project", "github", "url", "free_text", "conversation", "experience"))
    source_content = serializers.CharField(max_length=10000, required=False, allow_blank=False)
    repository_id = serializers.CharField(max_length=100, required=False)
    url = serializers.URLField(required=False)
    tone = serializers.ChoiceField(choices=Post.Tone.choices)
    length = serializers.ChoiceField(choices=("short", "medium", "long"))
    emoji_count = serializers.IntegerField(min_value=0, max_value=10)
    post_type = serializers.ChoiceField(choices=Post.Type.choices)
    call_to_action = serializers.ChoiceField(choices=("comment", "share", "follow", "link"), required=False)

    def validate(self, attrs):
        if attrs["mode"] == "url" and not attrs.get("url") and not attrs.get("source_content"):
            raise serializers.ValidationError("URL requiere una URL o contenido fuente.")
        if attrs["mode"] not in ("url", "github") and not attrs.get("source_content"):
            raise serializers.ValidationError("source_content es obligatorio para este modo.")
        return attrs


class ImprovePostSerializer(serializers.Serializer):
    content = serializers.CharField(max_length=3000)
    instruction = serializers.CharField(max_length=200)


class PostIdsSerializer(serializers.Serializer):
    post_ids = serializers.ListField(child=serializers.UUIDField(), min_length=1, max_length=20)


class AnalyticsSerializer(serializers.Serializer):
    impressions = serializers.ListField()
    likes = serializers.ListField()
    comments = serializers.ListField()
    followers = serializers.ListField()
    engagement_rate = serializers.FloatField()
    top_posts = PostSerializer(many=True)
    ai_insight = serializers.CharField()
