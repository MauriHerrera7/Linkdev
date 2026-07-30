"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { completeOnboarding } from "@/lib/api/endpoints";
import { getApiError } from "@/lib/api/client";
import type { OnboardingData, PostTone, PublishFrequency, UserGoal } from "@/lib/types";

const STEPS = ["Profesión", "Tecnologías", "Objetivo", "Estilo", "Preferencias"];

const TECH_OPTIONS = [
  "Python", "JavaScript", "TypeScript", "React", "Next.js", "Django", "Node.js",
  "PostgreSQL", "Docker", "AWS", "Go", "Rust", "Java", "Kotlin", "Flutter",
];

const GOALS: { value: UserGoal; label: string; description: string }[] = [
  { value: "job", label: "Conseguir trabajo", description: "Destacar skills y experiencia para recruiters" },
  { value: "personal_brand", label: "Marca personal", description: "Posicionarme como referente en mi área" },
  { value: "clients", label: "Conseguir clientes", description: "Mostrar expertise para atraer proyectos freelance" },
  { value: "networking", label: "Networking", description: "Conectar con otros profesionales del sector" },
];

const TONES: { value: PostTone; label: string; example: string }[] = [
  { value: "professional", label: "Profesional", example: "Comparto insights técnicos con un tono formal." },
  { value: "casual", label: "Casual", example: "Hablo de tech de forma relajada y accesible." },
  { value: "technical", label: "Técnico", example: "Profundizo en detalles de implementación y arquitectura." },
  { value: "inspirational", label: "Inspiracional", example: "Motivo y comparto aprendizajes de mi journey." },
  { value: "storytelling", label: "Storytelling", example: "Cuento historias con narrativa y emoción." },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    profession: "",
    technologies: [],
    goal: "personal_brand",
    tone: "professional",
    language: "es",
    publish_frequency: "3x_week",
  });

  const progress = ((step + 1) / STEPS.length) * 100;

  function toggleTech(tech: string) {
    setData((prev) => ({
      ...prev,
      technologies: prev.technologies.includes(tech)
        ? prev.technologies.filter((t) => t !== tech)
        : [...prev.technologies, tech],
    }));
  }

  async function handleFinish() {
    setLoading(true);
    try {
      await completeOnboarding(data);
      toast.success("¡Perfil configurado! Bienvenido a linkdev.");
      router.push("/generate");
    } catch (error) {
      toast.error(getApiError(error));
      router.push("/generate");
    } finally {
      setLoading(false);
    }
  }

  function next() {
    if (step < STEPS.length - 1) setStep(step + 1);
    else handleFinish();
  }

  function back() {
    if (step > 0) setStep(step - 1);
  }

  const canContinue = () => {
    if (step === 0) return data.profession.length > 0;
    if (step === 1) return data.technologies.length >= 1;
    return true;
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <Logo className="mb-8" />

      <div className="w-full max-w-lg">
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-sm text-muted-foreground">
            <span>Paso {step + 1} de {STEPS.length}</span>
            <span>{STEPS[step]}</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">¿A qué te dedicás?</h2>
                <p className="text-muted-foreground">Esto nos ayuda a personalizar tus publicaciones.</p>
                <div className="space-y-2">
                  <Label htmlFor="profession">Profesión / Rol</Label>
                  <Input
                    id="profession"
                    placeholder="Ej: Full Stack Developer, DevOps Engineer..."
                    value={data.profession}
                    onChange={(e) => setData({ ...data, profession: e.target.value })}
                    autoFocus
                  />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">¿Qué tecnologías dominás?</h2>
                <p className="text-muted-foreground">Seleccioná al menos una. Podés agregar más después.</p>
                <div className="flex flex-wrap gap-2">
                  {TECH_OPTIONS.map((tech) => (
                    <button
                      type="button"
                      key={tech}
                      onClick={() => toggleTech(tech)}
                      className={cn(
                        "rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-[var(--text)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:bg-white/5 dark:text-[var(--text)]",
                        data.technologies.includes(tech)
                          ? "border-[var(--brand-900)] bg-[var(--brand-100)] text-[var(--brand-900)] shadow-sm dark:border-[var(--brand-300)] dark:bg-white/10 dark:text-white"
                          : "hover:border-[var(--brand-900)] hover:bg-[var(--brand-100)] hover:text-[var(--brand-900)] dark:hover:border-[var(--brand-300)] dark:hover:bg-white/10"
                      )}
                    >
                      {data.technologies.includes(tech) && <Check className="mr-1 inline h-3 w-3" />}
                      {tech}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">¿Cuál es tu objetivo?</h2>
                <p className="text-muted-foreground">Adaptaremos el contenido a tu meta principal.</p>
                <div className="space-y-3">
                  {GOALS.map((g) => (
                    <button
                      type="button"
                      key={g.value}
                      onClick={() => setData({ ...data, goal: g.value })}
                      className={cn(
                        "w-full rounded-xl border border-border bg-card p-4 text-left text-[var(--text)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:bg-[var(--surface)]",
                        data.goal === g.value
                          ? "border-[var(--brand-900)] bg-[var(--brand-100)] text-[var(--brand-900)] shadow-sm dark:border-[var(--brand-300)] dark:bg-white/10 dark:text-white"
                          : "hover:border-[var(--brand-900)] hover:bg-[var(--brand-100)] hover:text-[var(--brand-900)] dark:hover:border-[var(--brand-300)] dark:hover:bg-white/10"
                      )}
                    >
                      <p className="font-medium">{g.label}</p>
                      <p className="text-sm text-muted-foreground">{g.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">¿Cómo preferís escribir?</h2>
                <p className="text-muted-foreground">Elegí el tono que mejor represente tu voz.</p>
                <div className="space-y-3">
                  {TONES.map((t) => (
                    <button
                      type="button"
                      key={t.value}
                      onClick={() => setData({ ...data, tone: t.value })}
                      className={cn(
                        "w-full rounded-xl border border-border bg-card p-4 text-left text-[var(--text)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:bg-[var(--surface)]",
                        data.tone === t.value
                          ? "border-[var(--brand-900)] bg-[var(--brand-100)] text-[var(--brand-900)] shadow-sm dark:border-[var(--brand-300)] dark:bg-white/10 dark:text-white"
                          : "hover:border-[var(--brand-900)] hover:bg-[var(--brand-100)] hover:text-[var(--brand-900)] dark:hover:border-[var(--brand-300)] dark:hover:bg-white/10"
                      )}
                    >
                      <p className="font-medium">{t.label}</p>
                      <p className="text-sm text-muted-foreground">{t.example}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">Últimos detalles</h2>
                  <p className="text-muted-foreground">Configurá idioma y frecuencia de publicación.</p>
                </div>
                <div className="space-y-2">
                  <Label>Idioma de las publicaciones</Label>
                  <Select value={data.language} onValueChange={(v) => setData({ ...data, language: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="pt">Português</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Frecuencia deseada</Label>
                  <Select
                    value={data.publish_frequency}
                    onValueChange={(v) => setData({ ...data, publish_frequency: v as PublishFrequency })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Diaria</SelectItem>
                      <SelectItem value="3x_week">3 veces por semana</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="biweekly">Quincenal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex justify-between">
          <Button variant="ghost" onClick={back} disabled={step === 0}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Atrás
          </Button>
          <Button variant="gradient" onClick={next} disabled={!canContinue()} loading={loading}>
            {step === STEPS.length - 1 ? "Comenzar" : "Continuar"}
            {step < STEPS.length - 1 && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Backend endpoint:
 * PATCH /api/users/me → { profession, technologies, goal, tone, language, publish_frequency, onboarding_completed: true }
 */
