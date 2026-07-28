import type {
  AnalyticsOverview,
  CalendarEvent,
  DashboardStats,
  Idea,
  Integration,
  Post,
  User,
} from "@/lib/types";

export const mockUser: User = {
  id: "1",
  email: "mauricio@linkdev.ai",
  name: "Mauricio Herrera",
  avatar_url: undefined,
  profession: "Full Stack Developer",
  technologies: ["Python", "Django", "React", "Next.js", "TypeScript", "PostgreSQL"],
  goal: "personal_brand",
  tone: "professional",
  language: "es",
  publish_frequency: "3x_week",
  onboarding_completed: true,
  created_at: "2025-01-15T10:00:00Z",
};

export const mockStats: DashboardStats = {
  total_posts: 47,
  scheduled_posts: 5,
  total_impressions: 128400,
  engagement_rate: 4.2,
  followers_growth: 342,
  streak_days: 12,
};

export const mockIdeas: Idea[] = [
  {
    id: "1",
    title: "Por qué elegí Django REST Framework para mi API",
    description: "Comparte tu experiencia eligiendo DRF sobre FastAPI o Node.js para un proyecto real.",
    category: "backend",
    tags: ["Django", "API", "Arquitectura"],
    is_saved: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "5 errores que cometí al migrar a Next.js App Router",
    description: "Lecciones aprendidas durante una migración de Pages Router a App Router.",
    category: "frontend",
    tags: ["Next.js", "React", "Migración"],
    is_saved: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Cómo uso IA para acelerar mi flujo de desarrollo",
    description: "Herramientas y prompts que uso diariamente como desarrollador.",
    category: "ai",
    tags: ["IA", "Productividad", "DevTools"],
    is_saved: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Mi rutina matutina como desarrollador remoto",
    description: "Cómo estructuro mis mañanas para máxima productividad.",
    category: "productivity",
    tags: ["Remote", "Hábitos"],
    is_saved: false,
    created_at: new Date().toISOString(),
  },
];

export const mockPosts: Post[] = [
  {
    id: "1",
    content:
      "Hoy completé la migración de nuestro backend a Django REST Framework.\n\n3 lecciones clave:\n\n→ Serializers bien diseñados ahorran horas de debugging\n→ JWT + refresh tokens simplifican la auth\n→ Tests con pytest-django son un game changer\n\n¿Qué framework usan para sus APIs?",
    status: "published",
    published_at: "2025-07-15T14:00:00Z",
    created_at: "2025-07-14T10:00:00Z",
    updated_at: "2025-07-15T14:00:00Z",
    tone: "professional",
    post_type: "story",
    impressions: 4520,
    likes: 89,
    comments: 23,
    shares: 5,
  },
  {
    id: "2",
    content:
      "🚀 Acabo de lanzar linkdev — una plataforma que transforma tu trabajo diario en contenido de LinkedIn.\n\nEl problema: sabemos que LinkedIn genera oportunidades, pero no tenemos tiempo ni ideas.\n\nLa solución: IA que aprende tu estilo y genera publicaciones auténticas.",
    status: "scheduled",
    scheduled_at: "2025-07-18T10:00:00Z",
    created_at: "2025-07-16T08:00:00Z",
    updated_at: "2025-07-16T08:00:00Z",
    tone: "inspirational",
    post_type: "achievement",
  },
  {
    id: "3",
    content:
      "Tip rápido para devs: antes de optimizar, mide.\n\nAyer reduje el tiempo de respuesta de una API de 800ms a 120ms.\n\nEl culpable no era lo que pensaba — era un N+1 query escondido en un serializer.",
    status: "draft",
    created_at: "2025-07-17T09:00:00Z",
    updated_at: "2025-07-17T09:00:00Z",
    tone: "casual",
    post_type: "tip",
  },
];

export const mockAnalytics: AnalyticsOverview = {
  impressions: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split("T")[0],
    value: Math.floor(Math.random() * 3000) + 1000,
  })),
  likes: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split("T")[0],
    value: Math.floor(Math.random() * 80) + 20,
  })),
  comments: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split("T")[0],
    value: Math.floor(Math.random() * 20) + 5,
  })),
  followers: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split("T")[0],
    value: 1200 + i * 12 + Math.floor(Math.random() * 10),
  })),
  engagement_rate: 4.2,
  top_posts: mockPosts.filter((p) => p.status === "published"),
  ai_insight:
    "Tu publicación sobre Django REST Framework tuvo un 3.2x más engagement que el promedio. Los posts técnicos con listas numeradas y preguntas al final generan 40% más comentarios. Publicar los martes entre 10-11 AM maximiza tu alcance según tu audiencia.",
};

export const mockCalendarEvents: CalendarEvent[] = mockPosts
  .filter((p) => p.scheduled_at || p.published_at)
  .map((p) => ({
    id: p.id,
    post_id: p.id,
    title: p.content.slice(0, 50) + "...",
    content: p.content,
    status: p.status,
    scheduled_at: p.scheduled_at ?? p.published_at!,
  }));

export const mockIntegrations: Integration[] = [
  { provider: "github", connected: true, username: "mauricio-herrera", connected_at: "2025-06-01T00:00:00Z" },
  { provider: "linkedin", connected: false },
];

export const CATEGORY_LABELS: Record<string, string> = {
  backend: "Backend",
  frontend: "Frontend",
  ai: "Inteligencia Artificial",
  productivity: "Productividad",
  career: "Carrera profesional",
  mistakes: "Errores",
  learnings: "Aprendizajes",
  opinions: "Opiniones",
  tutorials: "Tutoriales",
};

export const STATUS_LABELS: Record<string, string> = {
  draft: "Borrador",
  scheduled: "Programado",
  published: "Publicado",
};
