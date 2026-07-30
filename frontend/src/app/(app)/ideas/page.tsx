"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bookmark, Lightbulb, Search, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/shared/empty-state";
import { getIdeas } from "@/lib/api/endpoints";
import { CATEGORY_LABELS, mockIdeas } from "@/lib/mock-data";
import type { IdeaCategory } from "@/lib/types";
import Link from "next/link";

const CATEGORIES: (IdeaCategory | "all")[] = [
  "all", "backend", "frontend", "ai", "productivity", "career",
  "mistakes", "learnings", "opinions", "tutorials",
];

export default function IdeasPage() {
  const [category, setCategory] = useState<IdeaCategory | "all">("all");
  const [search, setSearch] = useState("");
  const [ideas, setIdeas] = useState(mockIdeas);
  const [loadingIdeas, setLoadingIdeas] = useState(false);

  const filtered = ideas.filter((idea) => {
    const matchCategory = category === "all" || idea.category === category;
    const matchSearch =
      !search ||
      idea.title.toLowerCase().includes(search.toLowerCase()) ||
      idea.description.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  function toggleSave(id: string) {
    setIdeas((prev) =>
      prev.map((i) => (i.id === id ? { ...i, is_saved: !i.is_saved } : i))
    );
  }

  async function handleGenerateIdeas() {
    setLoadingIdeas(true);
    try {
      const generatedIdeas = await getIdeas(category === "all" ? undefined : category);
      setIdeas((previousIdeas) => {
        const existingIds = new Set(previousIdeas.map((idea) => idea.id));
        const freshIdeas = generatedIdeas.filter((idea) => !existingIds.has(idea.id));
        return [...freshIdeas, ...previousIdeas];
      });
      toast.success("Ideas generadas con IA");
    } catch {
      toast.error("No pudimos generar ideas en este momento");
    } finally {
      setLoadingIdeas(false);
    }
  }

  return (
    <AppShell title="Banco de Ideas">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar ideas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="gradient" onClick={handleGenerateIdeas} loading={loadingIdeas}>
            <Sparkles className="mr-2 h-4 w-4" />
            Generar ideas con IA
          </Button>
        </div>

        <Tabs value={category} onValueChange={(v) => setCategory(v as IdeaCategory | "all")}>
          <TabsList className="h-auto flex flex-nowrap gap-2 overflow-x-auto pb-2 pr-2 sm:flex-wrap sm:overflow-visible sm:pb-0 sm:pr-0">
            {CATEGORIES.map((cat) => (
              <TabsTrigger key={cat} value={cat} className="text-xs min-w-max">
                {cat === "all" ? "Todas" : CATEGORY_LABELS[cat]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {filtered.length === 0 ? (
          <EmptyState
            icon={Lightbulb}
            title="No hay ideas en esta categoría"
            description="Probá otra categoría o generá ideas nuevas con IA."
            action={{ label: "Generar ideas", onClick: handleGenerateIdeas }}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((idea, i) => (
              <motion.div
                key={idea.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="group h-full transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                  <CardContent className="flex h-full flex-col p-5">
                    <div className="mb-3 flex items-start justify-between">
                      <Badge variant="secondary">{CATEGORY_LABELS[idea.category]}</Badge>
                      <IconButton
                        icon={Bookmark}
                        active={idea.is_saved}
                        label={idea.is_saved ? "Quitar de guardadas" : "Guardar idea"}
                        onClick={() => toggleSave(idea.id)}
                        className="h-9 w-9"
                      />
                    </div>
                    <h3 className="mb-2 font-semibold group-hover:text-primary">{idea.title}</h3>
                    <p className="mb-4 flex-1 text-sm text-muted-foreground">{idea.description}</p>
                    <div className="mb-4 flex flex-wrap gap-1">
                      {idea.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href={`/generate?idea=${idea.id}`}>Usar esta idea</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

/**
 * Backend endpoints:
 * POST /api/ai/ideas → { category? } → Idea[]
 * PATCH /api/ideas/:id → { is_saved: boolean }
 */
