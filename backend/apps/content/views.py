from rest_framework import generics
from .models import Post
from .serializers import PostSerializer


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
