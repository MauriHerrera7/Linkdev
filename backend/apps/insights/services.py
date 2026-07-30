import re

from .gemini import generate_text as generate_gemini_text

LENGTH_LIMITS = {"short": 500, "medium": 1000, "long": 2000}
GOAL_HINTS = {
    "job": "buscar oportunidades laborales",
    "personal_brand": "fortalecer la marca personal",
    "clients": "atraer clientes",
    "networking": "expandir la red profesional",
}
POST_TYPE_HINTS = {
    "story": "contá una historia con un aprendizaje concreto",
    "tip": "compartí un consejo práctico y accionable",
    "tutorial": "ordenalo en pasos claros y fáciles de seguir",
    "opinion": "planteá una opinión con contexto y criterio",
    "achievement": "destacá un logro y el aprendizaje que dejó",
    "question": "cerrá con una pregunta que invite a responder",
}
TONE_HINTS = {
    "professional": "profesional y claro",
    "casual": "cercano y conversacional",
    "technical": "técnico, preciso y sin humo",
    "inspirational": "motivador y humano",
    "storytelling": "narrativo, con gancho y ritmo",
}
CTA_HINTS = {
    "comment": "terminá con una pregunta que invite a comentar",
    "share": "cerrá invitando a compartir",
    "follow": "cerrá invitando a seguir la cuenta",
    "link": "cerrá mencionando un enlace o recurso útil",
}

def _normalize_text(text):
    text = text.replace("\r\n", "\n").strip()
    fenced = re.match(r"^```(?:\w+)?\n(.*)\n```$", text, flags=re.S)
    if fenced:
        text = fenced.group(1).strip()
    if len(text) >= 2 and text[0] == text[-1] and text[0] in {'"', "'"}:
        text = text[1:-1].strip()
    return re.sub(r"[ \t]+\n", "\n", text)


def _trim_to_limit(text, limit):
    text = _normalize_text(text)
    if len(text) <= limit:
        return text
    cutoff = text[: max(1, limit - 1)]
    if " " in cutoff:
        cutoff = cutoff.rsplit(" ", 1)[0]
    cutoff = cutoff.strip()
    return (cutoff or text[: max(1, limit - 1)].strip()) + "…"


def _format_technologies(user):
    technologies = getattr(user, "technologies", None) or []
    if isinstance(technologies, str):
        technologies = [technologies]
    return ", ".join(item for item in technologies if item)


def _user_profile_summary(user):
    parts = []
    if getattr(user, "profession", ""):
        parts.append(f"profesión: {user.profession}")
    technologies = _format_technologies(user)
    if technologies:
        parts.append(f"tecnologías: {technologies}")
    if getattr(user, "goal", ""):
        parts.append(f"objetivo: {GOAL_HINTS.get(user.goal, user.goal)}")
    if getattr(user, "tone", ""):
        parts.append(f"tono preferido: {TONE_HINTS.get(user.tone, user.tone)}")
    if getattr(user, "language", ""):
        parts.append(f"idioma: {user.language}")
    return "; ".join(parts) if parts else "sin datos extra"


def _build_generation_prompt(user, payload):
    source = payload.get("source_content") or payload.get("repository_id") or payload.get("url") or "una experiencia profesional"
    source = source.strip()[:7000]
    prompt_lines = [
        "Sos un redactor senior especializado en publicaciones para profesionales de tecnología.",
        "Escribí en español rioplatense natural, con tono humano y auténtico.",
        "Devolvé solo la publicación final, sin introducción, sin lista de instrucciones y sin comillas.",
        f"Perfil del usuario: {_user_profile_summary(user)}.",
        f"Modo de entrada: {payload['mode']}.",
        f"Tono deseado: {TONE_HINTS[payload['tone']]}.",
        f"Tipo de publicación: {POST_TYPE_HINTS[payload['post_type']]}.",
        f"Longitud objetivo: no superes aproximadamente {LENGTH_LIMITS[payload['length']]} caracteres.",
        f"Usá hasta {payload['emoji_count']} emojis, sólo si aportan claridad o energía.",
        f"Call to action sugerido: {CTA_HINTS.get(payload.get('call_to_action'), 'cerrá con una pregunta natural si suma conversación')}.",
    ]
    if payload.get("repository_id"):
        prompt_lines.append(f"Repositorio de GitHub seleccionado: {payload['repository_id']}.")
    if payload.get("url"):
        prompt_lines.append(f"URL de referencia: {payload['url']}.")
    prompt_lines.extend(["Fuente base:", source])
    return "\n".join(prompt_lines)


def _generate_local_post_content(user, payload):
    source = payload.get("source_content") or payload.get("repository_id") or payload.get("url") or "una experiencia profesional"
    source = re.sub(r"\s+", " ", source).strip()
    tone = payload["tone"]
    post_type = payload["post_type"]
    heading = {
        "story": "Hoy quiero compartir una experiencia.",
        "tip": "Un consejo que me ahorró tiempo.",
        "tutorial": "Así abordo este problema paso a paso.",
        "opinion": "Una opinión que fui formando con la práctica.",
        "achievement": "Un logro que me dejó un aprendizaje.",
        "question": "Una pregunta que vale la pena conversar.",
    }[post_type]
    profile = f"Como {user.profession}, " if user.profession else ""
    content = (
        f"{heading}\n\n"
        f"{profile}{source[:700]}\n\n"
        "Lo más importante no fue solo el resultado: fue entender el problema, probar alternativas y documentar lo aprendido.\n\n"
    )
    if tone == "technical":
        content += "Mi foco estuvo en tomar decisiones explícitas, medir el impacto y evitar complejidad innecesaria.\n\n"
    elif tone == "inspirational":
        content += "Los avances sostenidos nacen de compartir el proceso, incluso cuando todavía estamos aprendiendo.\n\n"
    elif tone == "casual":
        content += "A veces una mejora pequeña termina enseñándonos muchísimo.\n\n"
    cta = payload.get("call_to_action")
    calls = {
        "comment": "¿Qué experiencia tuviste con algo similar?",
        "share": "Si te resultó útil, compartilo con alguien de tu equipo.",
        "follow": "Seguime para más aprendizajes prácticos.",
        "link": "Dejo más contexto en el enlace de mi perfil.",
    }
    content += calls.get(cta, "¿Cómo lo resolvés vos?")
    if payload["emoji_count"]:
        content += " ✨" * payload["emoji_count"]
    return _trim_to_limit(content, LENGTH_LIMITS[payload["length"]])


def generate_post_content(user, payload):
    gemini_text = generate_gemini_text(_build_generation_prompt(user, payload))
    if gemini_text:
        return _trim_to_limit(gemini_text, LENGTH_LIMITS[payload["length"]])
    return _generate_local_post_content(user, payload)


def _build_improve_prompt(content, instruction):
    return "\n".join(
        [
            "Reescribí la publicación para cumplir con la instrucción del usuario.",
            "Mantené la idea central, el idioma español y un tono natural.",
            "Devolvé sólo el texto final, sin explicaciones adicionales.",
            f"Instrucción: {instruction.strip()}.",
            "Contenido original:",
            content.strip(),
        ]
    )


def _improve_content_local(content, instruction):
    instruction = instruction.lower()
    if "corta" in instruction:
        half = max(1, len(content) // 2)
        shortened = content[:half].rstrip()
        if " " in shortened:
            shortened = shortened.rsplit(" ", 1)[0]
        return f"{shortened or content[:half].strip()}."
    if "cta" in instruction:
        return f"{content.rstrip()}\n\n¿Qué opinión o experiencia sumarías?"
    if "técnica" in instruction or "tecnica" in instruction:
        return f"{content.rstrip()}\n\nEl criterio clave fue medir, validar supuestos y mantener una implementación simple."
    return content


def improve_content(content, instruction):
    gemini_text = generate_gemini_text(_build_improve_prompt(content, instruction))
    if gemini_text:
        return _trim_to_limit(gemini_text, 3000)
    return _trim_to_limit(_improve_content_local(content, instruction), 3000)
