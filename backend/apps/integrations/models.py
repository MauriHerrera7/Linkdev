from django.conf import settings
from django.db import models


class Integration(models.Model):
    class Provider(models.TextChoices):
        GITHUB = "github", "GitHub"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="integrations")
    provider = models.CharField(max_length=20, choices=Provider.choices)
    username = models.CharField(max_length=255, blank=True)
    connected_at = models.DateTimeField(null=True, blank=True)
    access_token = models.TextField(blank=True)
    refresh_token = models.TextField(blank=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=("user", "provider"), name="unique_user_provider")]
