from django.urls import path
from .views import PostDetailView, PostListCreateView

urlpatterns = [
    path("posts", PostListCreateView.as_view()),
    path("posts/<uuid:pk>", PostDetailView.as_view()),
]
