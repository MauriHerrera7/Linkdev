import re
from datetime import timedelta
from django.utils import timezone
from apps.content.models import Post


def generate_post_content(user, payload):
    source = payload.get("source_content") or payload.get("url") or "una experiencia profesional"
    source = re.sub(r"\s+", " ", source).strip()
    tone = payload["tone"]
    post_type = payload["post_type"]
    length_limits = {"short": 500, "medium": 1000, "long": 2000}
    heading = {"story": "Hoy quiero compartir una experiencia.", "tip": "Un consejo que me ahorró tiempo.", "tutorial": "Así abordo este problema paso a paso.", "opinion": "Una opinión que fui formando con la práctica.", "achievement": "Un logro que me dejó un aprendizaje.", "question": "Una pregunta que vale la pena conversar."}[post_type]
    profile = f"Como {user.profession}, " if user.profession else ""
    content = f"{heading}\n\n{profile}{source[:700]}\n\nLo más importante no fue solo el resultado: fue entender el problema, probar alternativas y documentar lo aprendido.\n\n"
    if tone == "technical":
        content += "Mi foco estuvo en tomar decisiones explícitas, medir el impacto y evitar complejidad innecesaria.\n\n"
    elif tone == "inspirational":
        content += "Los avances sostenidos nacen de compartir el proceso, incluso cuando todavía estamos aprendiendo.\n\n"
    elif tone == "casual":
        content += "A veces una mejora pequeña termina enseñándonos muchísimo.\n\n"
    cta = payload.get("call_to_action")
    calls = {"comment": "¿Qué experiencia tuviste con algo similar?", "share": "Si te resultó útil, compartilo con alguien de tu equipo.", "follow": "Seguime para más aprendizajes prácticos.", "link": "Dejo más contexto en el enlace de mi perfil."}
    content += calls.get(cta, "¿Cómo lo resolvés vos?")
    emojis = " ✨" * payload["emoji_count"]
    return (content + emojis)[:length_limits[payload["length"]]]


def improve_content(content, instruction):
    instruction = instruction.lower()
    if "corta" in instruction:
        return content[: max(1, len(content) // 2)].rsplit(" ", 1)[0] + "."
    if "cta" in instruction:
        return f"{content.rstrip()}\n\n¿Qué opinión o experiencia sumarías?"
    if "técnica" in instruction or "tecnica" in instruction:
        return f"{content.rstrip()}\n\nEl criterio clave fue medir, validar supuestos y mantener una implementación simple."
    return content


def analytics_overview(user, period):
    days = {"7d": 7, "30d": 30, "90d": 90}.get(period)
    if not days:
        raise ValueError("Período inválido.")
    start = timezone.now() - timedelta(days=days)
    posts = Post.objects.filter(author=user, published_at__gte=start).order_by("-impressions")
    dates = [(start + timedelta(days=index)).date().isoformat() for index in range(days)]
    metrics = {"impressions": [], "likes": [], "comments": [], "followers": []}
    for date in dates:
        values = {key: sum(getattr(post, key, 0) for post in posts.filter(published_at__date=date)) for key in ("impressions", "likes", "comments")}
        for key in values:
            metrics[key].append({"date": date, "value": values[key]})
        metrics["followers"].append({"date": date, "value": 0})
    impressions = sum(point["value"] for point in metrics["impressions"])
    interactions = sum(point["value"] for point in metrics["likes"]) + sum(point["value"] for point in metrics["comments"])
    rate = round(interactions / impressions * 100, 2) if impressions else 0
    return {**metrics, "engagement_rate": rate, "top_posts": posts[:5], "ai_insight": "Todavía no hay suficientes métricas sincronizadas para generar un insight específico." if not impressions else "Tus publicaciones con mayor interacción combinan una experiencia concreta con una pregunta de cierre."}
