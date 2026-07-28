from django.urls import path
from .views import CalendarView, DashboardStatsView, PostDetailView, PostListCreateView

urlpatterns = [
    path("posts", PostListCreateView.as_view()),
    path("posts/<uuid:pk>", PostDetailView.as_view()),
    path("calendar", CalendarView.as_view()),
    path("dashboard/stats", DashboardStatsView.as_view()),
]
