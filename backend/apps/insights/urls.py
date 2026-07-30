from django.urls import path
from .views import GeneratePostView, ImprovePostView

urlpatterns = [
    path("ai/generate", GeneratePostView.as_view()),
    path("ai/improve", ImprovePostView.as_view()),
]
