"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  Eye,
  Heart,
  Lightbulb,
  MessageSquare,
  PenLine,
  Share2,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";

import { formatNumber, formatRelativeDate } from "@/lib/utils";
import { mockIdeas, mockPosts, mockStats, mockUser } from "@/lib/mock-data";

function StatCard({
  label,
  value,
  icon: Icon,
  trend,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: string;
}) {
  return (
    <div className="rounded-[1.75rem] bg-card p-5 shadow-lg">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-primary/10 text-primary">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-text-muted">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-text">{value}</p>
          {trend && <p className="mt-1 text-xs font-medium text-success">{trend}</p>}
        </div>
      </div>
    </div>
  );
}

function PostCard({ post }: { post: (typeof mockPosts)[number] }) {
  const statusLabel = post.status === "published" ? "Publicado" : post.status === "scheduled" ? "Programado" : "Borrador";

  return (
    <article className="overflow-hidden rounded-[2rem] bg-card shadow-lg transition-all duration-200 hover:-translate-y-1">
      <div className="px-6 py-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-primary/10 text-primary font-semibold">
              LD
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-text">{mockUser.name}</p>
              <p className="text-xs text-text-muted">{statusLabel}</p>
            </div>
          </div>
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-text-muted">
            {formatRelativeDate(post.updated_at)}
          </span>
        </div>
      </div>

      <div className="px-6 py-6">
        <p className="whitespace-pre-line text-sm leading-7 text-text-secondary">{post.content}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3 px-6 py-4 text-sm text-text-muted">
        <div className="flex items-center gap-2 rounded-full bg-muted/80 px-3 py-2">
          <Heart className="h-4 w-4 text-primary" />
          {post.likes ?? 0}
        </div>
        <div className="flex items-center gap-2 rounded-full bg-muted/80 px-3 py-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          {post.comments ?? 0}
        </div>
        <div className="flex items-center gap-2 rounded-full bg-muted/80 px-3 py-2">
          <Share2 className="h-4 w-4 text-primary" />
          {post.shares ?? 0}
        </div>
      </div>
    </article>
  );
}

export default function DashboardPage() {
  const stats = mockStats;
  const ideas = mockIdeas.slice(0, 3);
  const recentPosts = mockPosts;
  const scheduled = mockPosts.filter((p) => p.status === "scheduled");

  return (
    <AppShell
      title={`Hola, ${mockUser.name.split(" ")[0]} 👋`}
    >
      <div className="rounded-[2rem] p-4 lg:p-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(280px,320px)_minmax(0,1.5fr)_minmax(300px,360px)]">
          <section className="space-y-6">
            <Card className="rounded-[2rem] border-0 bg-card shadow-lg">
              <CardHeader>
                <CardTitle>Panel de control</CardTitle>
                <CardDescription>Resúmenes rápidos y accesos directos.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  <StatCard label="Impresiones" value={formatNumber(stats.total_impressions)} icon={Eye} trend="+12 %" />
                  <StatCard label="Engagement" value={`${stats.engagement_rate}%`} icon={TrendingUp} trend="+0.8 %" />
                  <StatCard label="Seguidores" value={`+${stats.followers_growth}`} icon={Users} trend="Última semana" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-0 bg-card shadow-lg">
              <CardHeader>
                <CardTitle>Acciones rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="gradient" className="w-full justify-center" asChild>
                  <Link href="/generate">
                    <Sparkles className="mr-2 h-4 w-4" /> Generar publicación
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-center" asChild>
                  <Link href="/ideas">
                    <Lightbulb className="mr-2 h-4 w-4" /> Ver ideas
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-center" asChild>
                  <Link href="/calendar">
                    <Calendar className="mr-2 h-4 w-4" /> Calendario
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-0 bg-card shadow-lg">
              <CardHeader>
                <CardTitle>Ideas destacadas</CardTitle>
                <CardDescription>{ideas.length} sugerencias para publicar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {ideas.map((idea) => (
                  <div key={idea.id} className="rounded-3xl bg-card p-4 shadow-sm">
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-text">
                      <Lightbulb className="h-4 w-4 text-primary" />
                      {idea.title}
                    </div>
                    <p className="text-sm leading-6 text-text-muted">{idea.description}</p>
                  </div>
                ))}
                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <Link href="/ideas">
                    Explorar más ideas <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-6">
            <Card className="rounded-[2rem] border-0 bg-card shadow-lg">
              <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Crear publicación</CardTitle>
                  <CardDescription>Genera contenido en segundos con IA y guarda tus ideas.</CardDescription>
                </div>
                <Button variant="secondary" className="h-11 px-5" asChild>
                  <Link href="/generate">Usar IA</Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-[1.75rem] bg-card p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-primary/10 text-primary font-semibold">
                      LD
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text">{mockUser.name}</p>
                      <p className="text-sm text-text-muted">Crea contenido alineado con tu voz profesional.</p>
                    </div>
                  </div>
                  <textarea
                    rows={5}
                    readOnly
                    value="Hoy pensé en cómo transformar mi trabajo diario en una publicación sencilla y útil."
                    className="w-full resize-none rounded-[1.5rem] bg-muted px-4 py-4 text-sm leading-7 text-text-secondary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button variant="gradient">Generar publicación</Button>
                  <Button variant="outline">Importar idea</Button>
                  <Button variant="ghost">Programar</Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-5">
              {recentPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <Card className="rounded-[2rem] border-0 bg-card shadow-lg">
              <CardHeader>
                <CardTitle>Perspectiva</CardTitle>
                <CardDescription>Las tendencias que conviene seguir ahora.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-3xl bg-primary/10 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Tendencia</p>
                      <p className="mt-2 text-lg font-semibold text-text">Publicaciones educativas</p>
                    </div>
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <p className="mt-3 text-sm text-text-muted">
                    Contenidos que enseñan y cierran con una pregunta reciben más interacciones.
                  </p>
                </div>
                <div className="grid gap-3">
                  <div className="rounded-3xl bg-card p-4">
                    <p className="text-sm text-text-muted">Impresiones</p>
                    <p className="mt-2 text-2xl font-semibold text-text">{formatNumber(stats.total_impressions)}</p>
                  </div>
                  <div className="rounded-3xl bg-card p-4">
                    <p className="text-sm text-text-muted">Crecimiento de seguidores</p>
                    <p className="mt-2 text-2xl font-semibold text-text">+{stats.followers_growth}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-0 bg-card shadow-lg">
              <CardHeader>
                <CardTitle>Publicaciones programadas</CardTitle>
                <CardDescription>{scheduled.length} pendientes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {scheduled.length === 0 ? (
                  <p className="text-sm text-text-muted">No hay publicaciones programadas.</p>
                ) : (
                  scheduled.map((post) => (
                    <div key={post.id} className="rounded-3xl bg-card p-4 shadow-sm">
                      <div className="mb-3 flex items-center justify-between gap-3 text-xs text-text-muted">
                        <Badge variant="secondary">Programado</Badge>
                        <span>{post.scheduled_at && formatRelativeDate(post.scheduled_at)}</span>
                      </div>
                      <p className="text-sm leading-6 text-text-secondary line-clamp-3">{post.content}</p>
                    </div>
                  ))
                )}
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/calendar">Ver calendario completo</Link>
                </Button>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </AppShell>
  );
}

/**
 * Backend endpoints:
 * GET /api/dashboard/stats → DashboardStats
 * GET /api/ai/ideas/daily → Idea[]
 * GET /api/posts?limit=5 → Post[]
 */
