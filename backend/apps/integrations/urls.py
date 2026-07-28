from django.urls import path

from .views import (
    GitHubCommitsView,
    GitHubOAuthCallbackView,
    GitHubOAuthStartView,
    GitHubRepositoriesView,
    IntegrationsView,
    LinkedInOAuthCallbackView,
    LinkedInOAuthStartView,
)

urlpatterns = [
    path("integrations", IntegrationsView.as_view()),
    path("auth/github", GitHubOAuthStartView.as_view()),
    path("auth/linkedin", LinkedInOAuthStartView.as_view()),
    path("auth/github/callback", GitHubOAuthCallbackView.as_view(), name="github-oauth-callback"),
    path("auth/linkedin/callback", LinkedInOAuthCallbackView.as_view(), name="linkedin-oauth-callback"),
    path("github/connect", GitHubOAuthStartView.as_view()),
    path("linkedin/connect", LinkedInOAuthStartView.as_view()),
    path("github/repositories", GitHubRepositoriesView.as_view()),
    path("github/repositories/<path:repository>/commits", GitHubCommitsView.as_view()),
]
