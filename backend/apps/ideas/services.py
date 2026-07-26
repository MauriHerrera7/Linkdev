from .models import Idea


def generate_ideas(user, category=None, count=6):
    category = category or Idea.Category.BACKEND
    profession = user.profession or "profesional"
    technologies = ", ".join(user.technologies[:3]) or "tu área de especialidad"
    templates = [
        ("Una decisión técnica que mejoró mi trabajo", "Contá el contexto, las alternativas y el resultado concreto."),
        ("El error que cambiaría en mi próximo proyecto", "Transformá un aprendizaje real en una guía útil para otros."),
        ("Cómo aplico una práctica simple cada semana", "Explicá el proceso, una herramienta y el impacto que tuvo."),
        ("Lo que aprendí resolviendo un problema difícil", "Compartí el razonamiento, no solo la solución final."),
        ("Una opinión impopular sobre mi especialidad", "Presentá un argumento equilibrado e invitá al debate."),
        ("Mi checklist antes de dar por terminado un proyecto", "Convertí tu método de trabajo en consejos accionables."),
    ]
    ideas = []
    for title, description in templates[:count]:
        ideas.append(Idea(owner=user, title=f"{title} como {profession}", description=f"{description} Podés conectarlo con {technologies}.", category=category, tags=[category, *user.technologies[:2]]))
    return Idea.objects.bulk_create(ideas)
