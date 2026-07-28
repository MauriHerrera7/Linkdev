from django.urls import path
from .views import DailyIdeasView, GenerateIdeasView, IdeaDetailView

urlpatterns = [
    path("ideas/<uuid:pk>", IdeaDetailView.as_view()),
    path("ai/ideas", GenerateIdeasView.as_view()),
    path("ai/ideas/daily", DailyIdeasView.as_view()),
]
