import json
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core import signing
from django.shortcuts import redirect
from django.urls import reverse
from django.utils import timezone
from rest_framework import generics, permissions, serializers
from rest_framework.exceptions import APIException
from rest_framework.response import Response
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.tokens import AccessToken

from .models import Integration
from .serializers import IntegrationSerializer


class IntegrationConfigurationError(APIException):
    status_code = 503
    default_detail = "La integración todavía no está configurada en el servidor."
    default_code = "integration_not_configured"


class OAuthFlowError(APIException):
    status_code = 400
    default_detail = "No se pudo completar el flujo OAuth."
    default_code = "oauth_flow_error"


class OAuthConfigurationError(APIException):
    status_code = 503
    default_detail = "Faltan credenciales OAuth en el servidor."
    default_code = "oauth_not_configured"


def _get_provider_config(provider: str) -> dict[str, str | list[str]]:
    if provider == Integration.Provider.GITHUB:
        return {
            "authorize_url": "https://github.com/login/oauth/authorize",
            "token_url": "https://github.com/login/oauth/access_token",
            "profile_url": "https://api.github.com/user",
            "repos_url": "https://api.github.com/user/repos",
            "commits_url": "https://api.github.com/repos/{repository}/commits",
            "scopes": ["read:user", "user:email", "repo"],
        }
    if provider == Integration.Provider.LINKEDIN:
        return {
            "authorize_url": "https://www.linkedin.com/oauth/v2/authorization",
            "token_url": "https://www.linkedin.com/oauth/v2/accessToken",
            "profile_url": "https://api.linkedin.com/v2/me",
            "scopes": ["r_liteprofile", "w_member_social"],
        }
    raise OAuthFlowError("Proveedor OAuth no soportado.")


def _resolve_user_from_token(raw_token: str):
    try:
        token = AccessToken(raw_token)
        user_id = token[api_settings.USER_ID_CLAIM]
        return get_user_model().objects.get(**{api_settings.USER_ID_FIELD: user_id})
    except Exception as exc:  # noqa: BLE001
        raise OAuthFlowError("El token de autenticación es inválido o expiró.") from exc


def _fetch_json(url: str, access_token: str, headers: dict[str, str] | None = None) -> dict | list:
    request_headers = {
        "Accept": "application/json",
        "User-Agent": "Linkdev/1.0",
        "Authorization": f"Bearer {access_token}",
    }
    if headers:
        request_headers.update(headers)
    request = Request(url, headers=request_headers, method="GET")
    try:
        with urlopen(request, timeout=15) as response:
            return json.loads(response.read().decode())
    except HTTPError as exc:
        detail = exc.read().decode() if exc.fp else exc.reason
        raise OAuthFlowError(f"No se pudo consultar el perfil remoto: {detail}") from exc
    except URLError as exc:
        raise OAuthFlowError("No se pudo conectar con el proveedor OAuth.") from exc


def _exchange_code(provider: str, code: str, redirect_uri: str) -> dict:
    config = _get_provider_config(provider)
    client_id = getattr(settings, f"{provider.upper()}_CLIENT_ID", "")
    client_secret = getattr(settings, f"{provider.upper()}_CLIENT_SECRET", "")
    if not client_id or not client_secret:
        raise OAuthConfigurationError()

    payload = {
        "code": code,
        "client_id": client_id,
        "client_secret": client_secret,
        "redirect_uri": redirect_uri,
    }
    if provider == Integration.Provider.LINKEDIN:
        payload["grant_type"] = "authorization_code"

    request = Request(
        config["token_url"],
        data=urlencode(payload).encode(),
        headers={"Accept": "application/json", "Content-Type": "application/x-www-form-urlencoded"},
        method="POST",
    )
    try:
        with urlopen(request, timeout=15) as response:
            return json.loads(response.read().decode())
    except HTTPError as exc:
        detail = exc.read().decode() if exc.fp else exc.reason
        raise OAuthFlowError(f"No se pudo intercambiar el código OAuth: {detail}") from exc
    except URLError as exc:
        raise OAuthFlowError("No se pudo conectar con el proveedor OAuth.") from exc


def _store_integration(user, provider: str, token_data: dict) -> Integration:
    access_token = token_data.get("access_token", "")
    refresh_token = token_data.get("refresh_token", "")
    username = ""

    if provider == Integration.Provider.GITHUB and access_token:
        profile = _fetch_json(_get_provider_config(provider)["profile_url"], access_token)
        username = profile.get("login", "") or profile.get("name", "")
    elif provider == Integration.Provider.LINKEDIN and access_token:
        profile = _fetch_json(_get_provider_config(provider)["profile_url"], access_token)
        first_name = profile.get("localizedFirstName", "")
        last_name = profile.get("localizedLastName", "")
        username = " ".join(part for part in [first_name, last_name] if part).strip()

    integration, _ = Integration.objects.update_or_create(
        user=user,
        provider=provider,
        defaults={
            "username": username,
            "connected_at": timezone.now(),
            "access_token": access_token,
            "refresh_token": refresh_token,
        },
    )
    return integration


def _integration_redirect(provider: str, status: str = "connected") -> str:
    frontend_url = settings.FRONTEND_URL.rstrip("/")
    return f"{frontend_url}/settings?integration={provider}&status={status}"


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
                IntegrationSerializer(integration).data if integration else {"provider": provider, "connected": False}
            )
        return Response(payload)


class OAuthStartView(generics.GenericAPIView):
    provider = None
    permission_classes = [permissions.AllowAny]
    serializer_class = serializers.Serializer

    def get(self, request):
        raw_token = request.query_params.get("token") or request.query_params.get("access_token")
        if not raw_token:
            raise OAuthFlowError("Necesitás iniciar sesión para conectar esta cuenta.")

        user = _resolve_user_from_token(raw_token)
        config = _get_provider_config(self.provider)
        callback_url = request.build_absolute_uri(reverse(f"{self.provider}-oauth-callback"))
        state = signing.dumps({"user_id": str(user.id), "provider": self.provider})
        params = {
            "client_id": getattr(settings, f"{self.provider.upper()}_CLIENT_ID", ""),
            "redirect_uri": callback_url,
            "response_type": "code",
            "state": state,
            "scope": " ".join(config["scopes"]),
        }
        if not params["client_id"]:
            raise OAuthConfigurationError()
        if self.provider == Integration.Provider.LINKEDIN:
            params["prompt"] = "consent"
        return redirect(f'{config["authorize_url"]}?{urlencode(params)}')


class GitHubOAuthStartView(OAuthStartView):
    provider = "github"


class LinkedInOAuthStartView(OAuthStartView):
    provider = "linkedin"


class OAuthCallbackView(generics.GenericAPIView):
    provider = None
    permission_classes = [permissions.AllowAny]
    serializer_class = serializers.Serializer

    def get(self, request):
        if request.query_params.get("error"):
            return redirect(_integration_redirect(self.provider, status="error"))

        code = request.query_params.get("code")
        state = request.query_params.get("state")
        if not code or not state:
            raise OAuthFlowError("Faltan parámetros en el callback OAuth.")

        try:
            payload = signing.loads(state, max_age=3600)
        except signing.BadSignature as exc:
            raise OAuthFlowError("El estado OAuth no es válido o expiró.") from exc

        if payload.get("provider") != self.provider:
            raise OAuthFlowError("El callback OAuth no coincide con el proveedor esperado.")

        user = get_user_model().objects.get(id=payload["user_id"])
        redirect_uri = request.build_absolute_uri(reverse(f"{self.provider}-oauth-callback"))
        token_data = _exchange_code(self.provider, code, redirect_uri)
        _store_integration(user, self.provider, token_data)
        return redirect(_integration_redirect(self.provider))


class GitHubOAuthCallbackView(OAuthCallbackView):
    provider = "github"


class LinkedInOAuthCallbackView(OAuthCallbackView):
    provider = "linkedin"


class GitHubRepositoriesView(generics.GenericAPIView):
    serializer_class = serializers.Serializer

    def get(self, request):
        integration = Integration.objects.filter(
            user=request.user,
            provider=Integration.Provider.GITHUB,
            connected_at__isnull=False,
        ).first()
        if not integration:
            raise IntegrationConfigurationError("Conectá GitHub antes de consultar repositorios.")

        repos_url = _get_provider_config(Integration.Provider.GITHUB)["repos_url"]
        repos = _fetch_json(
            f"{repos_url}?per_page=100&sort=updated&affiliation=owner,collaborator,organization_member",
            integration.access_token,
        )
        payload = [
            {
                "id": str(repo.get("id")),
                "name": repo.get("name", ""),
                "full_name": repo.get("full_name", ""),
                "description": repo.get("description") or "",
                "private": bool(repo.get("private")),
                "language": repo.get("language") or "",
                "html_url": repo.get("html_url", ""),
                "updated_at": repo.get("updated_at", ""),
            }
            for repo in repos
        ]
        return Response(payload)


class GitHubCommitsView(generics.GenericAPIView):
    serializer_class = serializers.Serializer

    def get(self, request, repository):
        integration = Integration.objects.filter(
            user=request.user,
            provider=Integration.Provider.GITHUB,
            connected_at__isnull=False,
        ).first()
        if not integration:
            raise IntegrationConfigurationError("Conectá GitHub antes de consultar commits.")

        commits_url = _get_provider_config(Integration.Provider.GITHUB)["commits_url"].format(repository=repository)
        commits = _fetch_json(f"{commits_url}?per_page=20", integration.access_token)
        payload = [
            {
                "sha": commit.get("sha", ""),
                "message": commit.get("commit", {}).get("message", ""),
                "author": commit.get("commit", {}).get("author", {}).get("name", ""),
                "date": commit.get("commit", {}).get("author", {}).get("date", ""),
                "html_url": commit.get("html_url", ""),
            }
            for commit in commits
        ]
        return Response(payload)
