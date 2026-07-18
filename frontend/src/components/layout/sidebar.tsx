"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Calendar,
  ChevronLeft,
  LayoutDashboard,
  Lightbulb,
  PenLine,
  Settings,
  Sparkles,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/generate", label: "Generar", icon: PenLine },
  { href: "/ideas", label: "Ideas", icon: Lightbulb },
  { href: "/calendar", label: "Calendario", icon: Calendar },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Configuración", icon: Settings },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-full flex-col bg-surface text-text transition-all duration-300",
        collapsed ? "w-16" : "w-68"
      )}
    >
      <div className={cn("flex h-16 items-center px-4", collapsed && "justify-center px-2")}> 
        <Logo showText={!collapsed} size="sm" />
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-text-secondary hover:bg-muted hover:text-text",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        {!collapsed ? (
          <Link
            href="/generate"
            className="flex items-center gap-2 rounded-2xl bg-primary px-3 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
          >
            <Sparkles className="h-4 w-4" />
            Nueva publicación
          </Link>
        ) : (
          <Link
            href="/generate"
            className="flex items-center justify-center rounded-2xl bg-primary p-3 text-primary-foreground shadow-sm"
            title="Nueva publicación"
          >
            <Sparkles className="h-4 w-4" />
          </Link>
        )}
        {onToggle && (
          <button
            onClick={onToggle}
            className="mt-3 flex w-full items-center justify-center rounded-2xl border border-border bg-muted px-3 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-muted/80 hover:text-text"
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
          </button>
        )}
      </div>
    </aside>
  );
}
