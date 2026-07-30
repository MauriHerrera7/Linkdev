from rest_framework import serializers
from apps.content.models import Post


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
        if attrs["mode"] == "github" and not attrs.get("repository_id") and not attrs.get("source_content"):
            raise serializers.ValidationError("GitHub requiere un repositorio o contenido fuente.")
        if attrs["mode"] not in ("url", "github") and not attrs.get("source_content"):
            raise serializers.ValidationError("source_content es obligatorio para este modo.")
        return attrs


class ImprovePostSerializer(serializers.Serializer):
    content = serializers.CharField(max_length=3000)
    instruction = serializers.CharField(max_length=200)
