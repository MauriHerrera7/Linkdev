from django.urls import path
from .views import GitHubOAuthStartView, GitHubRepositoriesView, IntegrationsView, LinkedInOAuthStartView

urlpatterns = [
    path("integrations", IntegrationsView.as_view()),
    path("auth/github", GitHubOAuthStartView.as_view()),
    path("auth/linkedin", LinkedInOAuthStartView.as_view()),
    path("github/connect", GitHubOAuthStartView.as_view()),
    path("linkedin/connect", LinkedInOAuthStartView.as_view()),
    path("github/repositories", GitHubRepositoriesView.as_view()),
]
