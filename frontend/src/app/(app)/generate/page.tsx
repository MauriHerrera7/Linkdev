"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  GitBranch,
  Globe,
  Lightbulb,
  Link2,
  MessageSquare,
  PenLine,
  Sparkles,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { LinkedInPreview } from "@/components/generate/linkedin-preview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { generatePost } from "@/lib/api/endpoints";
import type { GeneratePostRequest, PostLength, PostTone, PostType } from "@/lib/types";

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

  const currentMode = MODES.find((m) => m.id === mode)!;

  async function handleGenerate() {
    if (!sourceContent.trim()) {
      toast.error("Ingresá contenido para generar la publicación");
      return;
    }
    setLoading(true);
    try {
      const result = await generatePost({
        mode,
        source_content: sourceContent,
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
    <AppShell title="Generar publicación" description="Creá contenido con IA en segundos">
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left panel - Input & Controls */}
        <div className="space-y-6 lg:col-span-3">
          {/* Mode selector */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Modo de creación</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {MODES.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-lg border p-3 text-center text-xs transition-all",
                      mode === m.id
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/30"
                    )}
                  >
                    <m.icon className="h-5 w-5" />
                    {m.label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Source input */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{currentMode.label}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder={currentMode.placeholder}
                value={sourceContent}
                onChange={(e) => setSourceContent(e.target.value)}
                className="min-h-[140px]"
              />
              {mode === "github" && (
                <Button variant="outline" size="sm">
                  <GitBranch className="mr-2 h-4 w-4" />
                  Conectar repositorio
                </Button>
              )}
              {mode === "url" && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Globe className="h-3 w-3" />
                  Analizaremos el contenido de la URL automáticamente
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customization controls */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Personalización</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Tono</Label>
                  <Select value={tone} onValueChange={(v) => setTone(v as PostTone)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
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
                  <Select value={length} onValueChange={(v) => setLength(v as PostLength)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Corta (~500 chars)</SelectItem>
                      <SelectItem value="medium">Media (~1000 chars)</SelectItem>
                      <SelectItem value="long">Larga (~2000 chars)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tipo de publicación</Label>
                  <Select value={postType} onValueChange={(v) => setPostType(v as PostType)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
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
                  <Select value={cta || "none"} onValueChange={(v) => setCta(v === "none" ? "" : v)}>
                    <SelectTrigger><SelectValue placeholder="Opcional" /></SelectTrigger>
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

          <Button variant="gradient" size="lg" className="w-full" onClick={handleGenerate} loading={loading}>
            <Sparkles className="mr-2 h-4 w-4" />
            Generar publicación
          </Button>
        </div>

        {/* Right panel - Preview & Actions */}
        <div className="space-y-4 lg:col-span-2">
          <LinkedInPreview content={generatedContent} />

          {generatedContent && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <Tabs defaultValue="edit">
                <TabsList className="w-full">
                  <TabsTrigger value="edit" className="flex-1">Editar</TabsTrigger>
                  <TabsTrigger value="improve" className="flex-1">Mejorar con IA</TabsTrigger>
                </TabsList>
                <TabsContent value="edit">
                  <Textarea
                    value={generatedContent}
                    onChange={(e) => setGeneratedContent(e.target.value)}
                    className="min-h-[200px]"
                  />
                </TabsContent>
                <TabsContent value="improve">
                  <div className="flex flex-wrap gap-2">
                    {["Más profesional", "Más corta", "Agregar storytelling", "Mejorar CTA", "Más técnica"].map(
                      (action) => (
                        <Button key={action} variant="outline" size="sm">
                          {action}
                        </Button>
                      )
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">Guardar borrador</Button>
                <Button variant="gradient" className="flex-1">Programar</Button>
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
