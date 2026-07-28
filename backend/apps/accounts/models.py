import uuid
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("El email es obligatorio.")
        email = self.normalize_email(email)
        user = self.model(email=email, username=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    class Goal(models.TextChoices):
        JOB = "job", "Job"
        PERSONAL_BRAND = "personal_brand", "Personal brand"
        CLIENTS = "clients", "Clients"
        NETWORKING = "networking", "Networking"

    class Tone(models.TextChoices):
        PROFESSIONAL = "professional", "Professional"
        CASUAL = "casual", "Casual"
        TECHNICAL = "technical", "Technical"
        INSPIRATIONAL = "inspirational", "Inspirational"
        STORYTELLING = "storytelling", "Storytelling"

    class Frequency(models.TextChoices):
        DAILY = "daily", "Daily"
        THREE_WEEK = "3x_week", "3x week"
        WEEKLY = "weekly", "Weekly"
        BIWEEKLY = "biweekly", "Biweekly"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=150)
    avatar_url = models.URLField(blank=True)
    profession = models.CharField(max_length=120, blank=True)
    technologies = models.JSONField(default=list, blank=True)
    goal = models.CharField(max_length=20, choices=Goal.choices, blank=True)
    tone = models.CharField(max_length=20, choices=Tone.choices, blank=True)
    language = models.CharField(max_length=5, default="es")
    publish_frequency = models.CharField(max_length=12, choices=Frequency.choices, default=Frequency.THREE_WEEK)
    onboarding_completed = models.BooleanField(default=False)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]
    objects = UserManager()
