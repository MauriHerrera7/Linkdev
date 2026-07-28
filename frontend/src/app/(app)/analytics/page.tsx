"use client";

import { useEffect, useState } from "react";
import { Eye, MessageCircle, TrendingUp, Users } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAnalytics, getPostAnalytics } from "@/lib/api/endpoints";
import { getApiError } from "@/lib/api/client";
import type { AnalyticsOverview, Post } from "@/lib/types";

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsOverview>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState("");
  useEffect(() => { Promise.all([getAnalytics(), getPostAnalytics()]).then(([overview, published]) => { setAnalytics(overview); setPosts(published); }).catch((requestError) => setError(getApiError(requestError))); }, []);
  const impressions = analytics?.impressions.reduce((sum, item) => sum + item.value, 0) ?? 0;
  const likes = analytics?.likes.reduce((sum, item) => sum + item.value, 0) ?? 0;
  const comments = analytics?.comments.reduce((sum, item) => sum + item.value, 0) ?? 0;
  return <AppShell title="Analytics"><div className="space-y-6">{error && <p className="text-destructive">{error}</p>}<div className="grid gap-4 md:grid-cols-4">{[["Impresiones", impressions, Eye], ["Likes", likes, TrendingUp], ["Comentarios", comments, MessageCircle], ["Engagement", `${analytics?.engagement_rate ?? 0}%`, Users]].map(([label, value, Icon]) => { const MetricIcon = Icon as typeof Eye; return <Card key={label as string}><CardContent className="flex gap-3 p-5"><MetricIcon className="text-primary" /><div><p className="text-sm text-muted-foreground">{label}</p><p className="text-xl font-semibold">{value}</p></div></CardContent></Card>; })}</div><Card><CardHeader><CardTitle>Insight de IA</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">{analytics?.ai_insight ?? "Cargando métricas reales..."}</p></CardContent></Card><Card><CardHeader><CardTitle>Publicaciones publicadas</CardTitle></CardHeader><CardContent className="space-y-3">{posts.length ? posts.map((post) => <div key={post.id} className="rounded-lg border p-4"><p>{post.content}</p><p className="mt-2 text-sm text-muted-foreground">{post.impressions ?? 0} impresiones · {post.likes ?? 0} likes · {post.comments ?? 0} comentarios</p></div>) : <p className="text-muted-foreground">Aún no hay métricas de publicaciones publicadas.</p>}</CardContent></Card></div></AppShell>;
}
