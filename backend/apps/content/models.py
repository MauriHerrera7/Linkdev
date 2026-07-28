import uuid
from django.conf import settings
from django.db import models


class Post(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        SCHEDULED = "scheduled", "Scheduled"
        PUBLISHED = "published", "Published"

    class Tone(models.TextChoices):
        PROFESSIONAL = "professional", "Professional"
        CASUAL = "casual", "Casual"
        TECHNICAL = "technical", "Technical"
        INSPIRATIONAL = "inspirational", "Inspirational"
        STORYTELLING = "storytelling", "Storytelling"

    class Type(models.TextChoices):
        STORY = "story", "Story"
        TIP = "tip", "Tip"
        TUTORIAL = "tutorial", "Tutorial"
        OPINION = "opinion", "Opinion"
        ACHIEVEMENT = "achievement", "Achievement"
        QUESTION = "question", "Question"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="posts")
    title = models.CharField(max_length=180, blank=True)
    content = models.TextField(max_length=3000)
    status = models.CharField(max_length=12, choices=Status.choices, default=Status.DRAFT)
    scheduled_at = models.DateTimeField(null=True, blank=True)
    published_at = models.DateTimeField(null=True, blank=True)
    tone = models.CharField(max_length=20, choices=Tone.choices, blank=True)
    post_type = models.CharField(max_length=20, choices=Type.choices, blank=True)
    source = models.CharField(max_length=50, blank=True)
    impressions = models.PositiveIntegerField(default=0)
    likes = models.PositiveIntegerField(default=0)
    comments = models.PositiveIntegerField(default=0)
    shares = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("-updated_at",)
        indexes = [models.Index(fields=("author", "status", "scheduled_at"))]
