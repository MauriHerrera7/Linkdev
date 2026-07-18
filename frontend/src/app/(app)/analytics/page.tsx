"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  ArrowUpRight,
  BarChart3,
  Eye,
  MessageCircle,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import { mockAnalytics, mockPosts } from "@/lib/mock-data";

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
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold">{value}</p>
          {trend && <p className="text-sm text-success">{trend}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AnalyticsPage() {
  const chartData = mockAnalytics.impressions.map((impression, index) => ({
    date: format(new Date(impression.date), "d MMM", { locale: es }),
    impressions: impression.value,
    likes: mockAnalytics.likes[index]?.value ?? 0,
    comments: mockAnalytics.comments[index]?.value ?? 0,
  }));

  const topPosts = mockAnalytics.top_posts.slice(0, 3);

  return (
    <AppShell title="Analytics" description="Entendé qué funciona y por qué">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Impresiones"
            value={formatNumber(mockAnalytics.impressions.reduce((acc, item) => acc + item.value, 0))}
            icon={Eye}
            trend="+12% esta semana"
          />
          <StatCard
            label="Likes"
            value={formatNumber(mockPosts.reduce((acc, post) => acc + (post.likes ?? 0), 0))}
            icon={TrendingUp}
            trend="+8% vs promedio"
          />
          <StatCard
            label="Comentarios"
            value={formatNumber(mockPosts.reduce((acc, post) => acc + (post.comments ?? 0), 0))}
            icon={MessageCircle}
            trend="+14% en posts con CTA"
          />
          <StatCard
            label="Seguidores"
            value={`+${formatNumber(mockAnalytics.followers[mockAnalytics.followers.length - 1]?.value ?? 0)}`}
            icon={Users}
            trend="Crecimiento estable"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Rendimiento de publicaciones
              </CardTitle>
              <CardDescription>Impresiones, likes y comentarios en los últimos 30 días.</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="impressions" stroke="#6366f1" fill="#6366f1" fillOpacity={0.16} />
                  <Area type="monotone" dataKey="likes" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.12} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Insight de IA
              </CardTitle>
              <CardDescription>Por qué algunas publicaciones funcionaron mejor.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <p className="text-sm leading-7 text-muted-foreground">{mockAnalytics.ai_insight}</p>
              </div>
              <div className="rounded-xl border border-border p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Engagement promedio</p>
                  <span className="text-sm font-semibold text-primary">{mockAnalytics.engagement_rate}%</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-muted">
                  <div className="h-2 w-[78%] rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <CardHeader>
              <CardTitle>Posts con mejor rendimiento</CardTitle>
              <CardDescription>Los que más impulso recibieron en la última semana.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {topPosts.map((post) => (
                <div key={post.id} className="rounded-xl border border-border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{post.content.split("\n")[0]}</p>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{post.content}</p>
                    </div>
                    <Badge variant="secondary">Top</Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-sm text-muted-foreground">
                    <span>{formatNumber(post.impressions ?? 0)} impresiones</span>
                    <span>•</span>
                    <span>{post.likes ?? 0} likes</span>
                    <span>•</span>
                    <span>{post.comments ?? 0} comentarios</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Seguimiento de crecimiento</CardTitle>
              <CardDescription>Tu audiencia crece de forma sostenida.</CardDescription>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockAnalytics.followers.map((item) => ({
                  date: format(new Date(item.date), "d MMM", { locale: es }),
                  followers: item.value,
                }))}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="followers" stroke="#22c55e" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
          <div>
            <p className="font-medium">Siguiente recomendación</p>
            <p className="text-sm text-muted-foreground">Publicá un tema técnico con una pregunta al cierre los martes a las 10:00.</p>
          </div>
          <Button variant="gradient">
            Ver plan de contenido
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
