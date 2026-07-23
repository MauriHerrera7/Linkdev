"use client";

import { useState } from "react";
import { Bot, KeyRound, Palette, Save, ShieldCheck, UserCircle } from "lucide-react";
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

const tabs = [
  { id: "profile", label: "Perfil", icon: UserCircle },
  { id: "integrations", label: "Integraciones", icon: ShieldCheck },
  { id: "ai", label: "IA", icon: Bot },
  { id: "appearance", label: "Apariencia", icon: Palette },
] as const;

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("profile");

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
              <CardDescription>Tu identidad y contexto para generar mejores publicaciones.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
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
              <div className="md:col-span-2 flex justify-end">
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
              <CardDescription>Conectá tus herramientas para generar contenido desde fuentes reales.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockIntegrations.map((integration) => (
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
              <div className="rounded-xl border border-border p-4">
                <Label>Modelo preferido</Label>
                <Select defaultValue="gpt4o">
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt4o">GPT-4o</SelectItem>
                    <SelectItem value="claude">Claude 3.5 Sonnet</SelectItem>
                    <SelectItem value="gemini">Gemini 2.0</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="rounded-xl border border-border p-4">
                <div className="flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-primary" />
                  <Label>API Keys</Label>
                </div>
                <Input placeholder="sk-..." className="mt-3" />
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
                  {['IA', 'Backend', 'Productividad', 'Carrera'].map((theme) => (
                    <Badge key={theme} variant="secondary">{theme}</Badge>
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
