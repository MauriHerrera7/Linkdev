"use client";

import Link from "next/link";
import { useState } from "react";
import { GitBranch, Link2 } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { socialLogin } from "@/lib/api/endpoints";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);

  async function handleSocialLogin(provider: "linkedin" | "github") {
    setLoading(true);
    try {
      await socialLogin(provider);
    } catch (error) {
      toast.error("No se pudo crear la cuenta. Intentá de nuevo.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 gap-8 px-4 py-10 lg:grid-cols-[1.5fr_1fr] lg:px-8">
        <div className="rounded-[2.5rem] bg-card px-12 py-16 shadow-[0_40px_80px_rgba(15,23,42,0.06)]">
          <div className="max-w-2xl space-y-8">
            <div className="flex items-center gap-4">
              <Logo showText className="text-blue-700 dark:text-white" />
              <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 dark:bg-slate-800 dark:text-blue-300">
                Tu contenido en un solo lugar
              </span>
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl font-bold tracking-tight text-slate-950 dark:text-white">
                Comenzá ahora.
              </h1>
              <p className="max-w-xl text-lg text-slate-600 dark:text-slate-300">
                Crea tu cuenta profesional con LinkedIn o GitHub y empieza a publicar fotos, ideas y proyectos.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-[2rem] bg-slate-100 p-6 dark:bg-slate-900 dark:ring-1 dark:ring-slate-700/30">
                <div className="mb-4 h-40 rounded-[1.75rem] bg-slate-200 dark:bg-slate-800" />
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Fotos profesionales</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Comparte trabajos y resultados con estilo.</p>
              </div>
              <div className="rounded-[2rem] bg-slate-100 p-6 dark:bg-slate-900 dark:ring-1 dark:ring-slate-700/30">
                <div className="mb-4 h-40 rounded-[1.75rem] bg-slate-200 dark:bg-slate-800" />
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Sin formularios largos</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Solo inicia sesión con tu cuenta profesional.</p>
              </div>
            </div>
            <div className="rounded-[2rem] bg-card p-6">
              <p className="text-sm font-semibold text-foreground">Más rápido para publicar</p>
              <p className="mt-2 text-sm text-muted-foreground">Configura tu perfil y comienza a compartir en segundos.</p>
            </div>
          </div>
        </div>
        <div className="rounded-[2rem] bg-card p-10 shadow-[0_30px_50px_rgba(15,23,42,0.06)]">
          <div className="mb-8 space-y-4 rounded-[1.75rem] bg-card p-8">
            <h1 className="text-4xl font-semibold text-foreground">Comenzar ahora</h1>
            <p className="text-sm text-muted-foreground">Creá tu cuenta profesional con LinkedIn o GitHub. Sin contraseñas, sin esperas.</p>
          </div>

          <div className="space-y-4">
            <Button
              variant="default"
              className="w-full justify-center rounded-[1.5rem] bg-[var(--primary)] text-[var(--primary-foreground)] shadow-lg"
              onClick={() => handleSocialLogin("linkedin")}
              loading={loading}
            >
              <Link2 className="mr-2 h-4 w-4" />
              Continuar con LinkedIn
            </Button>
            <Button
              variant="outline"
              className="w-full justify-center rounded-[1.5rem] border border-[var(--primary)] text-[var(--primary)]"
              onClick={() => handleSocialLogin("github")}
              loading={loading}
            >
              <GitBranch className="mr-2 h-4 w-4" />
              Continuar con GitHub
            </Button>
          </div>

          <div className="mt-8 rounded-[1.75rem] bg-card p-5 text-sm text-muted-foreground shadow-sm">
            <p className="font-semibold">Tu perfil, tus publicaciones.</p>
            <p className="mt-2 text-sm text-muted-foreground">Empezá con el plan gratuito y compartí tus primeras posts con fotos o capturas de proyectos.</p>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Ya tenés cuenta?{' '}
            <Link href="/login" className="font-semibold text-[var(--primary)] hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Backend endpoints:
 * GET /auth/linkedin → OAuth redirect
 * GET /auth/github → OAuth redirect
 */
