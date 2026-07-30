import json
from unittest.mock import patch

from django.test import override_settings
from rest_framework import status
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.test import APITestCase

from apps.accounts.models import User
from apps.content.models import Post


@override_settings(SECURE_SSL_REDIRECT=False)
class AuthenticationTests(APITestCase):
    def test_register_returns_tokens_and_user(self):
        response = self.client.post(
            "/api/auth/register",
            {"name": "Ada Lovelace", "email": "ada@example.com", "password": "A-strong-password-2026"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("access", response.data)
        self.assertEqual(response.data["user"]["email"], "ada@example.com")
        self.assertTrue(User.objects.filter(email="ada@example.com").exists())

    def test_login_rejects_invalid_password(self):
        User.objects.create_user(name="Ada Lovelace", email="ada@example.com", password="A-strong-password-2026")

        response = self.client.post("/api/auth/login", {"email": "ada@example.com", "password": "wrong-password"}, format="json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


@override_settings(SECURE_SSL_REDIRECT=False)
class PostTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(name="Owner User", email="owner@example.com", password="A-strong-password-2026")
        self.other_user = User.objects.create_user(name="Other User", email="other@example.com", password="A-strong-password-2026")
        self.client.force_authenticate(self.user)

    def test_post_is_created_for_authenticated_user(self):
        response = self.client.post(
            "/api/posts",
            {"content": "Contenido profesional validado.", "status": "draft", "tone": "professional", "post_type": "tip"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Post.objects.get().author, self.user)

    def test_user_cannot_access_another_users_post(self):
        post = Post.objects.create(author=self.other_user, content="Privado", status=Post.Status.DRAFT)

        response = self.client.get(f"/api/posts/{post.id}")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_scheduled_post_requires_future_date(self):
        response = self.client.post("/api/posts", {"content": "Contenido", "status": "scheduled"}, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


@override_settings(SECURE_SSL_REDIRECT=False)
class AITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(name="AI User", email="ai@example.com", password="A-strong-password-2026")
        self.client.force_authenticate(self.user)

    def test_generate_returns_local_content(self):
        response = self.client.post(
            "/api/ai/generate",
            {
                "mode": "idea",
                "source_content": "Migré una API a Django REST Framework.",
                "tone": "technical",
                "length": "medium",
                "emoji_count": 1,
                "post_type": "story",
                "call_to_action": "comment",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("content", response.data)
        self.assertIn("Django REST Framework", response.data["content"])

    @override_settings(GEMINI_API_KEY="gemini-test-key", GEMINI_MODEL="gemini-test-model")
    def test_generate_uses_gemini_when_available(self):
        class FakeResponse:
            def __init__(self, payload):
                self.payload = payload

            def __enter__(self):
                return self

            def __exit__(self, exc_type, exc, tb):
                return False

            def read(self):
                return json.dumps(self.payload).encode("utf-8")

        payload = {
            "candidates": [
                {
                    "content": {
                        "parts": [
                            {
                                "text": "Gemini listo para publicar.",
                            }
                        ]
                    }
                }
            ]
        }

        with patch("apps.insights.gemini.urlopen", return_value=FakeResponse(payload)):
            response = self.client.post(
                "/api/ai/generate",
                {
                    "mode": "idea",
                    "source_content": "Migré una API a Django REST Framework.",
                    "tone": "technical",
                    "length": "medium",
                    "emoji_count": 1,
                    "post_type": "story",
                    "call_to_action": "comment",
                },
                format="json",
            )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["content"], "Gemini listo para publicar.")


@override_settings(
    SECURE_SSL_REDIRECT=False,
    GITHUB_CLIENT_ID="github-client-id",
    GITHUB_CLIENT_SECRET="github-client-secret",
)
class OAuthTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(name="OAuth User", email="oauth@example.com", password="A-strong-password-2026")

    def test_github_start_redirects_with_access_token(self):
        token = str(AccessToken.for_user(self.user))

        response = self.client.get(f"/api/auth/github?token={token}")

        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertIn("github.com/login/oauth/authorize", response.url)
        self.assertIn("client_id=github-client-id", response.url)

    def test_github_repositories_requires_connection(self):
        self.client.force_authenticate(self.user)

        response = self.client.get("/api/github/repositories")

        self.assertEqual(response.status_code, status.HTTP_503_SERVICE_UNAVAILABLE)
