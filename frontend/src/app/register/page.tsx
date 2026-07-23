"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { type FormEvent, useState } from "react";
import { GitBranch, Link2 } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getApiError } from "@/lib/api/client";
import { register as signUp, socialLogin } from "@/lib/api/endpoints";

type SocialProvider = "linkedin" | "github";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [socialLoading, setSocialLoading] = useState<SocialProvider | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const isBusy = formLoading || socialLoading !== null;

  function saveSession(access: string, refresh: string) {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
  }

  async function handleSocialLogin(provider: SocialProvider) {
    setSocialLoading(provider);

    try {
      await socialLogin(provider);
    } catch {
      toast.error("No pudimos abrir LinkedIn o GitHub. Intentá de nuevo.");
      setSocialLoading(null);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormLoading(true);

    try {
      const auth = await signUp(formData.name.trim(), formData.email.trim(), formData.password);
      saveSession(auth.access, auth.refresh);
      toast.success("¡Cuenta creada con éxito!");
      router.push(auth.user.onboarding_completed ? "/dashboard" : "/onboarding");
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setFormLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 gap-8 px-4 py-10 lg:grid-cols-[1.5fr_1fr] lg:px-8">
        <div className="rounded-[2.5rem] bg-card px-12 py-16 shadow-[0_40px_80px_rgba(15,23,42,0.06)]">
          <div className="max-w-2xl space-y-8">
            <div className="flex items-center gap-4">
              <Logo size="md" />
              <span className="rounded-full border border-[var(--brand-100)] bg-[var(--brand-100)] px-4 py-2 text-sm font-semibold text-[var(--brand-900)] dark:border-slate-700 dark:bg-slate-800 dark:text-blue-300">
                Tu contenido en un solo lugar
              </span>
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl font-bold tracking-tight text-slate-950 dark:text-white">
                Empezá ahora.
              </h1>
              <p className="max-w-xl text-lg text-slate-600 dark:text-slate-300">
                Registrate con LinkedIn o GitHub y empezá a publicar fotos, ideas y proyectos.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-[2rem] bg-slate-100 p-6 dark:bg-slate-900 dark:ring-1 dark:ring-slate-700/30">
                <div className="relative mb-4 h-40 overflow-hidden rounded-[1.75rem] bg-slate-200 dark:bg-slate-800">
                  <Image
                    src="/auth/professional-photos.svg"
                    alt="Ilustración de fotos profesionales"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Fotos profesionales</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Compartí trabajos y resultados con estilo.</p>
              </div>
              <div className="rounded-[2rem] bg-slate-100 p-6 dark:bg-slate-900 dark:ring-1 dark:ring-slate-700/30">
                <div className="relative mb-4 h-40 overflow-hidden rounded-[1.75rem] bg-slate-200 dark:bg-slate-800">
                  <Image
                    src="/auth/short-forms.svg"
                    alt="Ilustración de formularios breves"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Sin formularios largos</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Solo iniciá sesión con tu cuenta profesional.</p>
              </div>
            </div>
            <div className="rounded-[2rem] bg-card p-6">
              <p className="text-sm font-semibold text-foreground">Más rápido para publicar</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Configurá tu perfil y comenzá a compartir en segundos.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] bg-card p-10 shadow-[0_30px_50px_rgba(15,23,42,0.06)]">
          <div className="mb-8 space-y-4 rounded-[1.75rem] bg-card p-8">
            <h1 className="text-4xl font-semibold text-foreground">Crear cuenta</h1>
            <p className="text-sm text-muted-foreground">
              Registrate con LinkedIn, GitHub o con tus datos para empezar rápido.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              variant="default"
              className="w-full justify-center rounded-[1.5rem] bg-[var(--brand-900)] text-white shadow-lg shadow-[rgba(10,60,110,0.18)] hover:bg-[var(--brand-600)]"
              onClick={() => handleSocialLogin("linkedin")}
              loading={socialLoading === "linkedin"}
              disabled={isBusy}
            >
              <Link2 className="mr-2 h-4 w-4" />
              Continuar con LinkedIn
            </Button>
            <Button
              variant="default"
              className="w-full justify-center rounded-[1.5rem] border border-black bg-black text-white shadow-sm shadow-black/15 hover:bg-neutral-900 hover:text-white dark:border-[var(--brand-300)] dark:bg-[var(--brand-900)] dark:text-white dark:hover:bg-[var(--brand-600)]"
              onClick={() => handleSocialLogin("github")}
              loading={socialLoading === "github"}
              disabled={isBusy}
            >
              <GitBranch className="mr-2 h-4 w-4" />
              Continuar con GitHub
            </Button>
          </div>

          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">o completá tus datos</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Tu nombre"
                autoComplete="name"
                value={formData.name}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, name: event.target.value }))
                }
                required
                disabled={isBusy}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="vos@empresa.com"
                autoComplete="email"
                value={formData.email}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, email: event.target.value }))
                }
                required
                disabled={isBusy}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Creá una clave segura"
                autoComplete="new-password"
                value={formData.password}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, password: event.target.value }))
                }
                required
                disabled={isBusy}
              />
            </div>

            <Button
              type="submit"
              variant="gradient"
              className="w-full rounded-[1.5rem]"
              loading={formLoading}
              disabled={socialLoading !== null}
            >
              Crear cuenta
            </Button>
          </form>

          <div className="mt-8 rounded-[1.75rem] bg-card p-5 text-sm text-muted-foreground shadow-sm">
            <p className="font-semibold text-foreground">Después podés conectar LinkedIn y GitHub.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Tu perfil queda listo para sumar tus cuentas y empezar a publicar contenido profesional.
            </p>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            ¿Ya tenés cuenta?{" "}
            <Link href="/login" className="font-semibold text-[var(--brand-900)] underline-offset-4 hover:text-[var(--brand-600)] hover:underline dark:text-[var(--primary)]">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
