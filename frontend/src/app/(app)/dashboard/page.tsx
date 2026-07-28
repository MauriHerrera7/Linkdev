"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Calendar, Eye, Lightbulb, TrendingUp, Users } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getApiError } from "@/lib/api/client";
import { getDashboardStats, getDailyIdeas, getMe, getPosts } from "@/lib/api/endpoints";
import type { DashboardStats, Idea, Post, User } from "@/lib/types";

export default function DashboardPage() {
  const [user, setUser] = useState<User>();
  const [stats, setStats] = useState<DashboardStats>();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getMe(), getDashboardStats(), getDailyIdeas(), getPosts({ status: "published", limit: 5 })])
      .then(([currentUser, currentStats, currentIdeas, currentPosts]) => {
        setUser(currentUser); setStats(currentStats); setIdeas(currentIdeas); setPosts(currentPosts);
      })
      .catch((requestError) => setError(getApiError(requestError)));
  }, []);

  const metrics = [
    ["Impresiones", stats?.total_impressions ?? 0, Eye],
    ["Engagement", `${stats?.engagement_rate ?? 0}%`, TrendingUp],
    ["Seguidores", `+${stats?.followers_growth ?? 0}`, Users],
  ] as const;

  return <AppShell title={`Hola, ${user?.name?.split(" ")[0] ?? ""} 👋`}>
    {error && <p className="rounded-lg border border-destructive/30 p-4 text-sm text-destructive">{error}</p>}
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">{metrics.map(([label, value, Icon]) => <Card key={label}><CardContent className="flex items-center gap-4 p-5"><Icon className="h-6 w-6 text-primary" /><div><p className="text-sm text-muted-foreground">{label}</p><p className="text-2xl font-semibold">{value}</p></div></CardContent></Card>)}</div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card><CardHeader><CardTitle>Publicaciones publicadas</CardTitle><CardDescription>Solo contenido visible en LinkedIn.</CardDescription></CardHeader><CardContent className="space-y-3">{posts.length ? posts.map((post) => <article key={post.id} className="rounded-lg border p-4"><p className="whitespace-pre-line text-sm">{post.content}</p><p className="mt-2 text-xs text-muted-foreground">{post.impressions ?? 0} impresiones · {post.likes ?? 0} likes</p></article>) : <p className="text-sm text-muted-foreground">Todavía no hay publicaciones publicadas.</p>}</CardContent></Card>
        <Card><CardHeader><CardTitle>Ideas para vos</CardTitle></CardHeader><CardContent className="space-y-3">{ideas.map((idea) => <div key={idea.id} className="rounded-lg border p-4"><p className="font-medium">{idea.title}</p><p className="mt-1 text-sm text-muted-foreground">{idea.description}</p></div>)}<Button variant="outline" className="w-full" asChild><Link href="/ideas"><Lightbulb className="mr-2 h-4 w-4" />Ver ideas</Link></Button></CardContent></Card>
      </div>
      <Button variant="gradient" asChild><Link href="/generate">Crear publicación</Link></Button><Button variant="ghost" asChild><Link href="/calendar"><Calendar className="mr-2 h-4 w-4" />Calendario</Link></Button>
    </div>
  </AppShell>;
}
