"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, GitBranch, Globe, Lightbulb, Link2, MessageSquare, PenLine, Sparkles, Wrench } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { LinkedInPreview } from "@/components/generate/linkedin-preview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  connectGitHub,
  generatePost,
  getGitHubCommits,
  getGitHubRepos,
  getIntegrations,
} from "@/lib/api/endpoints";
import type {
  GeneratePostRequest,
  GitHubCommit,
  GitHubRepository,
  Integration,
  PostLength,
  PostTone,
  PostType,
} from "@/lib/types";

const MODES = [
  { id: "idea", label: "Desde idea", icon: Lightbulb, placeholder: "Describe tu idea o tema..." },
  { id: "project", label: "Desde proyecto", icon: Wrench, placeholder: "Describe tu proyecto, qué hace, tecnologías..." },
  { id: "github", label: "Desde GitHub", icon: GitBranch, placeholder: "Seleccioná un repositorio o pega la URL..." },
  { id: "url", label: "Desde URL", icon: Link2, placeholder: "https://..." },
  { id: "free_text", label: "Texto libre", icon: PenLine, placeholder: "Escribí lo que quieras convertir en publicación..." },
  { id: "conversation", label: "Conversación", icon: MessageSquare, placeholder: "Pegá una conversación o debate interesante..." },
  { id: "experience", label: "Experiencia laboral", icon: Briefcase, placeholder: "Describe una experiencia, logro o aprendizaje..." },
] as const;

const DEMO_CONTENT = `Hoy completé la migración de nuestro backend a Django REST Framework.

3 lecciones clave:

→ Serializers bien diseñados ahorran horas de debugging
→ JWT + refresh tokens simplifican la auth
→ Tests con pytest-django son un game changer

¿Qué framework usan para sus APIs?`;

export default function GeneratePage() {
  const [mode, setMode] = useState<GeneratePostRequest["mode"]>("idea");
  const [sourceContent, setSourceContent] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [tone, setTone] = useState<PostTone>("professional");
  const [length, setLength] = useState<PostLength>("medium");
  const [emojiCount, setEmojiCount] = useState([2]);
  const [postType, setPostType] = useState<PostType>("story");
  const [cta, setCta] = useState("");
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
  const [selectedRepository, setSelectedRepository] = useState<GitHubRepository | null>(null);
  const [commits, setCommits] = useState<GitHubCommit[]>([]);
  const [repositoriesLoading, setRepositoriesLoading] = useState(false);

  useEffect(() => {
    getIntegrations().then(setIntegrations).catch(() => setIntegrations([]));
  }, []);

  const linkedInConnected = useMemo(
    () => integrations.some((integration) => integration.provider === "linkedin" && integration.connected),
    [integrations]
  );
  const githubConnected = useMemo(
    () => integrations.some((integration) => integration.provider === "github" && integration.connected),
    [integrations]
  );
  const githubActive = mode === "github" && githubConnected;
  const displayedRepositories = githubActive ? repositories : [];
  const displayedSelectedRepository = githubActive ? selectedRepository : null;
  const displayedCommits = githubActive ? commits : [];

  const currentMode = MODES.find((item) => item.id === mode)!;

  useEffect(() => {
    if (!githubActive) {
      return;
    }

    let active = true;
    Promise.resolve().then(() => {
      if (active) setRepositoriesLoading(true);
    });
    getGitHubRepos()
      .then((items) => {
        if (!active) return;
        setRepositories(items);
        setSelectedRepository((currentSelection) => currentSelection ?? items[0] ?? null);
      })
      .catch(() => {
        if (active) {
          setRepositories([]);
          setSelectedRepository(null);
          setCommits([]);
        }
      })
      .finally(() => {
        if (active) setRepositoriesLoading(false);
      });

    return () => {
      active = false;
    };
  }, [githubActive]);

  useEffect(() => {
    if (!githubActive || !selectedRepository?.full_name) {
      return;
    }

    let active = true;
    getGitHubCommits(selectedRepository.full_name)
      .then((items) => {
        if (active) setCommits(items);
      })
      .catch(() => {
        if (active) setCommits([]);
      });

    return () => {
      active = false;
    };
  }, [githubActive, selectedRepository]);

  async function handleGenerate() {
    if (!linkedInConnected) {
      toast.error("Conectá LinkedIn desde Configuración antes de generar o publicar.");
      return;
    }
    if (!sourceContent.trim()) {
      toast.error("Ingresá contenido para generar la publicación");
      return;
    }
    setLoading(true);
    try {
      const result = await generatePost({
        mode,
        source_content: sourceContent,
        repository_id: displayedSelectedRepository?.full_name,
        tone,
        length,
        emoji_count: emojiCount[0],
        post_type: postType,
        call_to_action: cta || undefined,
      });
      setGeneratedContent(result.content);
      toast.success("Publicación generada");
    } catch {
      setGeneratedContent(DEMO_CONTENT);
      toast.info("Modo demo: mostrando contenido de ejemplo");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell title="Generar publicación">
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Modo de creación</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {MODES.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setMode(item.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-3 text-center text-xs font-medium text-[var(--text)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:bg-[var(--surface)] dark:text-[var(--text)]",
                      mode === item.id
                        ? "border-[var(--brand-900)] bg-[var(--brand-100)] text-[var(--brand-900)] shadow-sm dark:border-[var(--brand-300)] dark:bg-white/10 dark:text-white"
                        : "hover:border-[var(--brand-900)] hover:bg-[var(--brand-100)] hover:text-[var(--brand-900)] dark:hover:border-[var(--brand-300)] dark:hover:bg-white/10"
                    )}
                    aria-pressed={mode === item.id}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{currentMode.label}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder={currentMode.placeholder}
                value={sourceContent}
                onChange={(event) => setSourceContent(event.target.value)}
                className="min-h-[140px]"
              />

              {mode === "github" && (
                <div className="space-y-3">
                  <Button variant="outline" size="sm" onClick={() => connectGitHub()}>
                    <GitBranch className="mr-2 h-4 w-4" />
                    Conectar GitHub
                  </Button>

                  {githubConnected && (
                    <div className="space-y-3 rounded-xl border border-border p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium">Repositorios conectados</p>
                          <p className="text-xs text-muted-foreground">
                            Elegí un repositorio para usarlo como fuente de contenido.
                          </p>
                        </div>
                        {displayedSelectedRepository && (
                          <span className="text-xs text-muted-foreground">
                            Seleccionado: {displayedSelectedRepository.full_name}
                          </span>
                        )}
                      </div>

                      {repositoriesLoading ? (
                        <p className="text-sm text-muted-foreground">Cargando repositorios…</p>
                      ) : displayedRepositories.length ? (
                        <div className="grid gap-2">
                          {displayedRepositories.slice(0, 6).map((repository) => (
                            <button
                              type="button"
                              key={repository.id}
                              onClick={() => setSelectedRepository(repository)}
                              className={`rounded-lg border p-3 text-left text-sm transition-all ${
                                selectedRepository?.id === repository.id
                                  ? "border-[var(--brand-900)] bg-[var(--brand-100)] text-[var(--brand-900)] dark:border-[var(--brand-300)] dark:bg-white/10 dark:text-white"
                                  : "border-border hover:border-[var(--brand-900)] hover:bg-[var(--brand-100)] dark:hover:border-[var(--brand-300)] dark:hover:bg-white/10"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <span className="font-medium">{repository.full_name}</span>
                                <span className="text-xs text-muted-foreground">{repository.private ? "Privado" : "Público"}</span>
                              </div>
                              <p className="mt-1 text-xs text-muted-foreground">{repository.description || "Sin descripción"}</p>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No encontramos repositorios todavía.</p>
                      )}

                      {displayedSelectedRepository && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Commits recientes</p>
                          {displayedCommits.length ? (
                            <div className="space-y-2">
                              {displayedCommits.slice(0, 5).map((commit) => (
                                <div key={commit.sha} className="rounded-lg border border-border p-3 text-xs">
                                  <p className="font-medium">{commit.message}</p>
                                  <p className="mt-1 text-muted-foreground">
                                    {commit.author} · {new Date(commit.date).toLocaleDateString()}
                                  </p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground">Todavía no hay commits para mostrar.</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {mode === "url" && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Globe className="h-3 w-3" />
                  Analizaremos el contenido de la URL automáticamente
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Personalización</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Tono</Label>
                  <Select value={tone} onValueChange={(value) => setTone(value as PostTone)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Profesional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="technical">Técnico</SelectItem>
                      <SelectItem value="inspirational">Inspiracional</SelectItem>
                      <SelectItem value="storytelling">Storytelling</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Longitud</Label>
                  <Select value={length} onValueChange={(value) => setLength(value as PostLength)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Corta (~500 chars)</SelectItem>
                      <SelectItem value="medium">Media (~1000 chars)</SelectItem>
                      <SelectItem value="long">Larga (~2000 chars)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tipo de publicación</Label>
                  <Select value={postType} onValueChange={(value) => setPostType(value as PostType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="story">Historia</SelectItem>
                      <SelectItem value="tip">Tip / Consejo</SelectItem>
                      <SelectItem value="tutorial">Tutorial</SelectItem>
                      <SelectItem value="opinion">Opinión</SelectItem>
                      <SelectItem value="achievement">Logro</SelectItem>
                      <SelectItem value="question">Pregunta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Call to action</Label>
                  <Select value={cta || "none"} onValueChange={(value) => setCta(value === "none" ? "" : value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Opcional" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Ninguno</SelectItem>
                      <SelectItem value="comment">Pedir comentarios</SelectItem>
                      <SelectItem value="share">Pedir compartir</SelectItem>
                      <SelectItem value="follow">Pedir seguir</SelectItem>
                      <SelectItem value="link">Incluir link</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Emojis</Label>
                  <span className="text-sm text-muted-foreground">{emojiCount[0]}</span>
                </div>
                <Slider value={emojiCount} onValueChange={setEmojiCount} min={0} max={10} step={1} />
              </div>
            </CardContent>
          </Card>

          <Button variant="gradient" size="lg" className="w-full" onClick={handleGenerate} loading={loading} disabled={!linkedInConnected}>
            <Sparkles className="mr-2 h-4 w-4" />
            Generar publicación
          </Button>
        </div>

        <div className="space-y-4 lg:col-span-2">
          <LinkedInPreview content={generatedContent} />

          {generatedContent && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <Tabs defaultValue="edit">
                <TabsList className="w-full">
                  <TabsTrigger value="edit" className="flex-1">
                    Editar
                  </TabsTrigger>
                  <TabsTrigger value="improve" className="flex-1">
                    Mejorar con IA
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="edit">
                  <Textarea value={generatedContent} onChange={(event) => setGeneratedContent(event.target.value)} className="min-h-[200px]" />
                </TabsContent>
                <TabsContent value="improve">
                  <div className="flex flex-wrap gap-2">
                    {["Más profesional", "Más corta", "Agregar storytelling", "Mejorar CTA", "Más técnica"].map((action) => (
                      <Button key={action} variant="outline" size="sm">
                        {action}
                      </Button>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  Guardar borrador
                </Button>
                <Button variant="gradient" className="flex-1" disabled={!linkedInConnected}>
                  Programar
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

/**
 * Backend endpoints:
 * POST /api/ai/generate → GeneratePostRequest → GeneratePostResponse
 * POST /api/ai/improve → { content, instruction } → { content }
 * POST /api/posts → { content, status: "draft" } → Post
 * POST /api/linkedin/schedule → { post_id, scheduled_at }
 * GET  /api/github/repositories → Repository[]
 */
