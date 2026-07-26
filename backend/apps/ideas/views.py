from rest_framework import generics
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from .models import Idea
from .serializers import IdeaSerializer
from .services import generate_ideas


class IdeaDetailView(generics.UpdateAPIView):
    serializer_class = IdeaSerializer
    http_method_names = ["patch"]

    def get_queryset(self):
        return Idea.objects.filter(owner=self.request.user)


class GenerateIdeasView(generics.GenericAPIView):
    serializer_class = IdeaSerializer
    def post(self, request):
        category = request.data.get("category")
        valid_categories = {value for value, _ in Idea.Category.choices}
        if category is not None and category not in valid_categories:
            raise ValidationError({"category": "Categoría inválida."})
        return Response(IdeaSerializer(generate_ideas(request.user, category), many=True).data)


class DailyIdeasView(generics.ListAPIView):
    serializer_class = IdeaSerializer

    def get_queryset(self):
        queryset = Idea.objects.filter(owner=self.request.user)
        if queryset.exists():
            return queryset[:3]
        return generate_ideas(self.request.user, count=3)
