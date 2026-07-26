from django.conf import settings
from rest_framework import generics, permissions, serializers
from rest_framework.exceptions import APIException
from rest_framework.response import Response
from .models import Integration
from .serializers import IntegrationSerializer


class IntegrationConfigurationError(APIException):
    status_code = 503
    default_detail = "La integración todavía no está configurada en el servidor."
    default_code = "integration_not_configured"


class IntegrationsView(generics.ListAPIView):
    serializer_class = IntegrationSerializer

    def get_queryset(self):
        return Integration.objects.filter(user=self.request.user)

    def list(self, request, *args, **kwargs):
        integrations = {item.provider: item for item in self.get_queryset()}
        payload = []
        for provider, _ in Integration.Provider.choices:
            integration = integrations.get(provider)
            payload.append(
                IntegrationSerializer(integration).data
                if integration
                else {"provider": provider, "connected": False}
            )
        return Response(payload)


class OAuthStartView(generics.GenericAPIView):
    provider = None
    permission_classes = [permissions.AllowAny]
    serializer_class = serializers.Serializer

    def get(self, request):
        client_id = getattr(settings, f"{self.provider.upper()}_CLIENT_ID", "")
        client_secret = getattr(settings, f"{self.provider.upper()}_CLIENT_SECRET", "")
        if not client_id or not client_secret:
            raise IntegrationConfigurationError()
        raise IntegrationConfigurationError("El callback OAuth requiere configurar el intercambio seguro de tokens antes de habilitar esta integración.")


class GitHubOAuthStartView(OAuthStartView):
    provider = "github"


class LinkedInOAuthStartView(OAuthStartView):
    provider = "linkedin"


class GitHubRepositoriesView(generics.GenericAPIView):
    serializer_class = serializers.Serializer
    def get(self, request):
        integration = Integration.objects.filter(user=request.user, provider=Integration.Provider.GITHUB, connected_at__isnull=False).first()
        if not integration:
            raise IntegrationConfigurationError("Conectá GitHub antes de consultar repositorios.")
        return Response([])
