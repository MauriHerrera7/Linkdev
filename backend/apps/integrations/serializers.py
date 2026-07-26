from rest_framework import serializers
from .models import Integration


class IntegrationSerializer(serializers.ModelSerializer):
    connected = serializers.SerializerMethodField()

    class Meta:
        model = Integration
        fields = ("provider", "connected", "username", "connected_at")

    def get_connected(self, instance) -> bool:
        return bool(instance.connected_at)
