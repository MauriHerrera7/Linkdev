import uuid
from rest_framework import generics, throttling
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from apps.content.models import Post
from apps.content.serializers import PostSerializer
from apps.integrations.models import Integration
from .serializers import AnalyticsSerializer, GeneratePostSerializer, ImprovePostSerializer, PostIdsSerializer
from .services import analytics_overview, generate_post_content, improve_content


class AIThrottle(throttling.UserRateThrottle):
    scope = "ai"


def require_content_integrations(user):
    providers = set(
        Integration.objects.filter(
            user=user,
            provider__in=(Integration.Provider.GITHUB, Integration.Provider.LINKEDIN),
            connected_at__isnull=False,
        ).values_list("provider", flat=True)
    )
    missing = {Integration.Provider.GITHUB, Integration.Provider.LINKEDIN} - providers
    if missing:
        raise ValidationError({"integrations": "Conectá GitHub y LinkedIn antes de generar contenido con IA."})


class GeneratePostView(generics.GenericAPIView):
    serializer_class = GeneratePostSerializer
    throttle_classes = [AIThrottle]

    def post(self, request):
        require_content_integrations(request.user)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        content = generate_post_content(request.user, serializer.validated_data)
        return Response({"id": str(uuid.uuid4()), "content": content, "suggestions": ["Revisá que el ejemplo refleje tu experiencia real."]})


class ImprovePostView(generics.GenericAPIView):
    serializer_class = ImprovePostSerializer
    throttle_classes = [AIThrottle]

    def post(self, request):
        require_content_integrations(request.user)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({"content": improve_content(**serializer.validated_data)})


class AnalyticsView(generics.GenericAPIView):
    serializer_class = AnalyticsSerializer
    def get(self, request):
        try:
            overview = analytics_overview(request.user, request.query_params.get("period", "30d"))
        except ValueError as exc:
            raise ValidationError({"period": str(exc)}) from exc
        return Response(AnalyticsSerializer(overview).data)


class PostAnalyticsView(generics.ListAPIView):
    serializer_class = PostSerializer

    def get_queryset(self):
        return Post.objects.filter(author=self.request.user, status=Post.Status.PUBLISHED).order_by("-impressions")


class AnalyticsInsightView(generics.GenericAPIView):
    serializer_class = PostIdsSerializer
    throttle_classes = [AIThrottle]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        post_ids = serializer.validated_data["post_ids"]
        count = Post.objects.filter(author=request.user, id__in=post_ids).count()
        if count != len(set(post_ids)):
            raise ValidationError({"post_ids": "Incluye publicaciones inexistentes."})
        return Response({"insight": "Compará el tema, el formato y el CTA de las publicaciones seleccionadas para identificar patrones sostenibles."})
