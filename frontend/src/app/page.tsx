"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  Calendar,
  GitBranch,
  Link2,
  PenLine,
  Sparkles,
  Zap,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const benefits = [
  {
    icon: Sparkles,
    title: "IA que aprende tu estilo",
    description: "Cada publicación se adapta a tu tono, tecnologías y objetivos profesionales.",
  },
  {
    icon: PenLine,
    title: "7 modos de creación",
    description: "Desde ideas, GitHub, URLs, proyectos o experiencias laborales — siempre hay contenido.",
  },
  {
    icon: Calendar,
    title: "Calendario inteligente",
    description: "Programá publicaciones y mantené la constancia sin esfuerzo.",
  },
  {
    icon: BarChart3,
    title: "Analytics con IA",
    description: "Entendé qué funciona y por qué, con explicaciones en lenguaje natural.",
  },
];

const steps = [
  { step: "01", title: "Conectá tus fuentes", description: "GitHub, LinkedIn o simplemente contanos sobre vos." },
  { step: "02", title: "Generá contenido", description: "Elegí un modo, personalizá el tono y dejá que la IA escriba." },
  { step: "03", title: "Publicá y crecé", description: "Programá, publicá y analizá tu crecimiento profesional." },
];

const faqs = [
  {
    q: "¿Necesito conectar LinkedIn para usar linkdev?",
    a: "No es obligatorio. Podés generar, editar y exportar publicaciones sin conectar LinkedIn. La integración permite programar y publicar directamente.",
  },
  {
    q: "¿La IA realmente aprende mi estilo de escritura?",
    a: "Sí. Durante el onboarding capturamos tu tono preferido, y con cada publicación la IA refina su comprensión de tu voz.",
  },
  {
    q: "¿Puedo usar contenido de mis repos de GitHub?",
    a: "Absolutamente. Conectá GitHub y generá publicaciones a partir de commits, PRs, READMEs y la estructura de tus proyectos.",
  },
  {
    q: "¿Hay plan gratuito?",
    a: "Sí, el plan Free incluye 5 publicaciones por mes. Los planes Pro y Team ofrecen generación ilimitada y analytics avanzados.",
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      setAuthenticated(true);
      router.replace("/dashboard");
    }
  }, [router]);

  if (authenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b border-border/50 glass">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 lg:px-8">
          <Logo />
          <div className="hidden items-center gap-8 md:flex">
            <a href="#beneficios" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Beneficios
            </a>
            <a href="#como-funciona" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Cómo funciona
            </a>
            <a href="#faq" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              FAQ
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Iniciar sesión</Link>
            </Button>
            <Button variant="gradient" asChild>
              <Link href="/register">Empezá gratis</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-violet-500/10 blur-3xl" />
        </div>
        <div className="mx-auto max-w-6xl px-4 text-center lg:px-8">
          <motion.div {...fadeUp}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm">
              <Zap className="h-4 w-4 text-primary" />
              Potenciado por GPT-4 y LangChain
            </div>
            <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl">
              Construí tu marca personal en{" "}
              <span className="gradient-text">LinkedIn</span> con IA
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground lg:text-xl">
              Transformá tu trabajo diario — commits, proyectos, experiencias — en publicaciones
              profesionales listas para compartir. Sin bloqueo creativo. Sin excusas.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button variant="gradient" size="lg" asChild>
                <Link href="/register">
                  Empezá gratis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Sin tarjeta de crédito · 5 publicaciones gratis al mes
            </p>
          </motion.div>

          {/* Hero preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mx-auto mt-16 max-w-3xl"
          >
            <div className="gradient-border rounded-2xl p-px">
              <div className="rounded-2xl bg-card p-6 text-left">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    MH
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Mauricio Herrera</p>
                    <p className="text-xs text-muted-foreground">Full Stack Developer · linkdev</p>
                  </div>
                </div>
                <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
                  {`Hoy completé la migración de nuestro backend a Django REST Framework.\n\n3 lecciones clave:\n\n→ Serializers bien diseñados ahorran horas\n→ JWT + refresh tokens simplifican la auth\n→ Tests con pytest-django son un game changer\n\n¿Qué framework usan para sus APIs?`}
                </p>
                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  <span>👍 89</span>
                  <span>💬 23</span>
                  <span>🔄 5</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section id="beneficios" className="border-t border-border py-20 lg:py-32">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
              Todo lo que necesitás para ser constante
            </h2>
            <p className="mt-4 text-muted-foreground">
              Herramientas diseñadas para desarrolladores que quieren crecer profesionalmente.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <b.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="border-t border-border bg-card py-20 lg:py-32">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">Cómo funciona</h2>
            <p className="mt-4 text-muted-foreground">De tu código a LinkedIn en 3 pasos.</p>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center"
              >
                <div className="mb-4 text-5xl font-bold text-primary/20">{s.step}</div>
                <h3 className="mb-2 text-xl font-semibold">{s.title}</h3>
                <p className="text-muted-foreground">{s.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-6xl px-4 text-center lg:px-8">
          <h2 className="mb-8 text-2xl font-bold">Integraciones nativas</h2>
          <div className="flex items-center justify-center gap-8">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3">
              <GitBranch className="h-6 w-6" />
              <span className="font-medium">GitHub</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3">
              <Link2 className="h-6 w-6 text-[#0A66C2]" />
              <span className="font-medium">LinkedIn</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-border py-20 lg:py-32">
        <div className="mx-auto max-w-2xl px-4 lg:px-8">
          <h2 className="mb-8 text-center text-3xl font-bold">Preguntas frecuentes</h2>
          <Accordion type="single" collapsible>
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger>{faq.q}</AccordionTrigger>
                <AccordionContent>{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-4xl px-4 text-center lg:px-8">
          <h2 className="text-3xl font-bold lg:text-4xl">
            Empezá a construir tu marca personal hoy
          </h2>
          <p className="mt-4 text-muted-foreground">
            Unite a cientos de desarrolladores que ya están creciendo en LinkedIn.
          </p>
          <Button variant="gradient" size="lg" className="mt-8" asChild>
            <Link href="/register">
              Crear cuenta gratis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row lg:px-8">
          <Logo size="sm" />
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} linkdev. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground">Privacidad</a>
            <a href="#" className="hover:text-foreground">Términos</a>
            <a href="#" className="hover:text-foreground">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
