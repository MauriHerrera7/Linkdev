from datetime import datetime
from django.db.models import Sum
from django.utils.timezone import make_aware
from rest_framework import generics, serializers
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from .models import Post
from .serializers import CalendarEventSerializer, PostSerializer


class OwnedPostMixin:
    def get_queryset(self):
        return Post.objects.filter(author=self.request.user)


class PostListCreateView(OwnedPostMixin, generics.ListCreateAPIView):
    serializer_class = PostSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        status = self.request.query_params.get("status")
        limit = self.request.query_params.get("limit")
        if status:
            queryset = queryset.filter(status=status)
        if limit:
            try:
                limit = min(max(int(limit), 1), 100)
            except ValueError as exc:
                raise ValidationError({"limit": "Debe ser un entero entre 1 y 100."}) from exc
            queryset = queryset[:limit]
        return queryset

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class PostDetailView(OwnedPostMixin, generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PostSerializer


class CalendarView(generics.ListAPIView):
    serializer_class = CalendarEventSerializer

    def get_queryset(self):
        month = self.request.query_params.get("month")
        if not month:
            raise ValidationError({"month": "Use el formato YYYY-MM."})
        try:
            start = make_aware(datetime.strptime(month, "%Y-%m"))
        except ValueError as exc:
            raise ValidationError({"month": "Use el formato YYYY-MM."}) from exc
        end = start.replace(year=start.year + 1, month=1) if start.month == 12 else start.replace(month=start.month + 1)
        return Post.objects.filter(author=self.request.user, scheduled_at__gte=start, scheduled_at__lt=end).exclude(status=Post.Status.DRAFT)


class DashboardStatsView(generics.GenericAPIView):
    serializer_class = serializers.Serializer
    def get(self, request):
        posts = Post.objects.filter(author=request.user)
        totals = posts.aggregate(total_impressions=Sum("impressions"))
        interactions = sum(posts.values_list("likes", "comments", "shares"), ())
        total_impressions = totals["total_impressions"] or 0
        engagement = round((sum(interactions) / total_impressions * 100), 2) if total_impressions else 0
        return Response({"total_posts": posts.count(), "scheduled_posts": posts.filter(status=Post.Status.SCHEDULED).count(), "total_impressions": total_impressions, "engagement_rate": engagement, "followers_growth": 0, "streak_days": 0})
