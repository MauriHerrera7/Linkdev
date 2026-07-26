from django.urls import path
from .views import AnalyticsInsightView, AnalyticsView, GeneratePostView, ImprovePostView, PostAnalyticsView

urlpatterns = [
    path("ai/generate", GeneratePostView.as_view()),
    path("ai/improve", ImprovePostView.as_view()),
    path("ai/analytics-insight", AnalyticsInsightView.as_view()),
    path("analytics", AnalyticsView.as_view()),
    path("analytics/posts", PostAnalyticsView.as_view()),
]
