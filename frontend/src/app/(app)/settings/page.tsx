"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Bot, Palette, Save, ShieldCheck, UserCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { mockIntegrations, mockUser } from "@/lib/mock-data";
import { connectGitHub, connectLinkedIn, getIntegrations } from "@/lib/api/endpoints";
import type { Integration } from "@/lib/types";

const tabs = [
  { id: "profile", label: "Perfil", icon: UserCircle },
  { id: "integrations", label: "Integraciones", icon: ShieldCheck },
  { id: "ai", label: "IA", icon: Bot },
  { id: "appearance", label: "Apariencia", icon: Palette },
] as const;

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("profile");
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const integrationStatus = searchParams.get("integration");
  const status = searchParams.get("status");

  useEffect(() => {
    getIntegrations().then(setIntegrations).catch(() => setIntegrations([]));
  }, []);

  useEffect(() => {
    if (!integrationStatus || !status) return;
    if (status === "connected") {
      toast.success(`${integrationStatus === "github" ? "GitHub" : "LinkedIn"} conectado correctamente.`);
    } else if (status === "error") {
      toast.error(`No pudimos conectar ${integrationStatus === "github" ? "GitHub" : "LinkedIn"}.`);
    }
    router.replace("/settings");
  }, [integrationStatus, router, status]);

  const displayedIntegrations = integrations.length ? integrations : mockIntegrations;
  const linkedInIntegration = displayedIntegrations.find((integration) => integration.provider === "linkedin");
  const githubIntegration = displayedIntegrations.find((integration) => integration.provider === "github");

  return (
    <AppShell title="Configuración">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                type="button"
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition-all ${
                  activeTab === tab.id
                    ? "border-[var(--brand-900)] bg-[var(--brand-100)] text-[var(--brand-900)] shadow-sm dark:border-[var(--brand-300)] dark:bg-white/10 dark:text-white"
                    : "border-border bg-card text-[var(--text-secondary)] hover:border-[var(--brand-900)] hover:bg-[var(--brand-100)] hover:text-[var(--brand-900)] dark:bg-[var(--surface)] dark:hover:border-[var(--brand-300)] dark:hover:bg-white/10"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === "profile" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle className="h-5 w-5 text-primary" />
                Perfil profesional
              </CardTitle>
              <CardDescription>Tu identidad, contexto y cuentas conectadas para generar mejores publicaciones.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nombre</Label>
                  <Input defaultValue={mockUser.name} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input defaultValue={mockUser.email} />
                </div>
                <div className="space-y-2">
                  <Label>Profesión</Label>
                  <Input defaultValue={mockUser.profession} />
                </div>
                <div className="space-y-2">
                  <Label>Idioma preferido</Label>
                  <Select defaultValue={mockUser.language}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="pt">Português</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label>Estilo de escritura</Label>
                  <Textarea defaultValue="Me gusta escribir con un tono profesional pero cercano, usando ejemplos y listas claras." className="min-h-24" />
                </div>
              </div>

              <div className="space-y-4 rounded-xl border border-border p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">Conexiones de cuenta</p>
                    <p className="text-sm text-muted-foreground">
                      LinkedIn es obligatorio para publicar; GitHub es opcional para sumar fuentes.
                    </p>
                  </div>
                  {!linkedInIntegration?.connected && <Badge variant="destructive">LinkedIn requerido</Badge>}
                </div>

                <div className="space-y-3">
                  <div className="flex flex-col gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium">LinkedIn</p>
                      <p className="text-sm text-muted-foreground">
                        {linkedInIntegration?.connected
                          ? `Conectado como ${linkedInIntegration.username}`
                          : "Conectá tu cuenta para habilitar publicación y programación."}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={linkedInIntegration?.connected ? "secondary" : "outline"}>
                        {linkedInIntegration?.connected ? "Activo" : "Pendiente"}
                      </Badge>
                      {!linkedInIntegration?.connected && (
                        <Button size="sm" onClick={() => connectLinkedIn()}>
                          Conectar
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium">GitHub</p>
                      <p className="text-sm text-muted-foreground">
                        {githubIntegration?.connected
                          ? `Conectado como ${githubIntegration.username}`
                          : "Opcional. Sirve para generar contenido desde repos y commits."}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={githubIntegration?.connected ? "secondary" : "outline"}>
                        {githubIntegration?.connected ? "Activo" : "Pendiente"}
                      </Badge>
                      {!githubIntegration?.connected && (
                        <Button size="sm" onClick={() => connectGitHub()}>
                          Conectar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="gradient">
                  <Save className="mr-2 h-4 w-4" />
                  Guardar cambios
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "integrations" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Integraciones
              </CardTitle>
              <CardDescription>Revisá el estado de tus conexiones y asegurate de tener LinkedIn activo.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!linkedInIntegration?.connected && (
                <div className="flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-300">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  LinkedIn debe estar conectado para publicar y programar desde la app.
                </div>
              )}
              {displayedIntegrations.map((integration) => (
                <div key={integration.provider} className="flex items-center justify-between rounded-xl border border-border p-4">
                  <div>
                    <p className="font-medium capitalize">{integration.provider}</p>
                    <p className="text-sm text-muted-foreground">
                      {integration.connected ? `Conectado como ${integration.username}` : "Sin conectar"}
                    </p>
                  </div>
                  <Badge variant={integration.connected ? "secondary" : "outline"}>
                    {integration.connected ? "Activo" : "Desconectado"}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {activeTab === "ai" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                Preferencias de IA
              </CardTitle>
              <CardDescription>Controlá cuánta ayuda querés de la inteligencia artificial.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-xl border border-border p-4">
                <div>
                  <p className="font-medium">Generación automática de ideas</p>
                  <p className="text-sm text-muted-foreground">Sugiere contenido automáticamente cada día.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border p-4">
                <div>
                  <p className="font-medium">Reescritura con IA</p>
                  <p className="text-sm text-muted-foreground">Mejora texto y tono al instante.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "appearance" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Apariencia y tema
              </CardTitle>
              <CardDescription>Personalizá la estética de la plataforma.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-xl border border-border p-4">
                <div>
                  <p className="font-medium">Modo oscuro</p>
                  <p className="text-sm text-muted-foreground">Diseño premium por defecto.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="rounded-xl border border-border p-4">
                <Label>Temas favoritos</Label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["IA", "Backend", "Productividad", "Carrera"].map((theme) => (
                    <Badge key={theme} variant="secondary">
                      {theme}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-border p-4">
                <Label>Foco visual</Label>
                <Select defaultValue="minimal">
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minimal">Minimalista</SelectItem>
                    <SelectItem value="focus">Enfocado</SelectItem>
                    <SelectItem value="dense">Más denso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
