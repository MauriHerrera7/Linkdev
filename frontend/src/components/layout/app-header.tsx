"use client";

import { Bell, LogOut, Menu, Moon, Search, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { IconButton } from "@/components/ui/icon-button";
import { mockUser } from "@/lib/mock-data";

interface AppHeaderProps {
  title: string;
  description?: string;
  onMenuClick?: () => void;
}

export function AppHeader({ title, description, onMenuClick }: AppHeaderProps) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const initials = mockUser.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <header className="flex h-16 items-center justify-between bg-surface/90 px-4 shadow-sm backdrop-blur-xl lg:px-6">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <IconButton label="Abrir menú" icon={Menu} className="lg:hidden" onClick={onMenuClick} />
        )}
        <div>
          <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      </div>

      <div className="hidden items-center gap-3 rounded-full border border-border bg-muted px-3 py-2 shadow-sm lg:flex">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          type="search"
          placeholder="Buscar publicaciones..."
          className="min-w-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="flex items-center gap-2">
        <IconButton
          label={theme === "dark" ? "Cambiar a claro" : "Cambiar a oscuro"}
          icon={theme === "dark" ? Sun : Moon}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        />
        <IconButton label="Notificaciones" icon={Bell} />
        <Avatar className="h-9 w-9 cursor-pointer">
          <AvatarFallback className="bg-primary/10 text-xs text-primary">{initials}</AvatarFallback>
        </Avatar>
        <IconButton
          label="Cerrar sesión"
          icon={LogOut}
          onClick={() => {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            router.replace("/");
          }}
        />
      </div>
    </header>
  );
}
