import uuid
from rest_framework import generics, throttling
from rest_framework.response import Response
from .serializers import GeneratePostSerializer, ImprovePostSerializer
from .services import generate_post_content, improve_content


class AIThrottle(throttling.UserRateThrottle):
    scope = "ai"


class GeneratePostView(generics.GenericAPIView):
    serializer_class = GeneratePostSerializer
    throttle_classes = [AIThrottle]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        content = generate_post_content(request.user, serializer.validated_data)
        return Response({"id": str(uuid.uuid4()), "content": content, "suggestions": ["Revisá que el ejemplo refleje tu experiencia real."]})


class ImprovePostView(generics.GenericAPIView):
    serializer_class = ImprovePostSerializer
    throttle_classes = [AIThrottle]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({"content": improve_content(**serializer.validated_data)})
