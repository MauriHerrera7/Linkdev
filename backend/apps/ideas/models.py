import uuid
from django.conf import settings
from django.db import models


class Idea(models.Model):
    class Category(models.TextChoices):
        BACKEND = "backend", "Backend"
        FRONTEND = "frontend", "Frontend"
        AI = "ai", "AI"
        PRODUCTIVITY = "productivity", "Productivity"
        CAREER = "career", "Career"
        MISTAKES = "mistakes", "Mistakes"
        LEARNINGS = "learnings", "Learnings"
        OPINIONS = "opinions", "Opinions"
        TUTORIALS = "tutorials", "Tutorials"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="ideas")
    title = models.CharField(max_length=180)
    description = models.TextField(max_length=1000)
    category = models.CharField(max_length=20, choices=Category.choices)
    tags = models.JSONField(default=list)
    is_saved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-created_at",)
        indexes = [models.Index(fields=("owner", "category", "is_saved"))]
