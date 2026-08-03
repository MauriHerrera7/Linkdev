"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  Lightbulb,
  PenLine,
  Settings,
  Sparkles,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/generate", label: "Generar", icon: PenLine },
  { href: "/ideas", label: "Ideas", icon: Lightbulb },
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
        "flex h-full max-w-full flex-col bg-surface text-text transition-all duration-300",
        collapsed ? "w-16" : "w-68"
      )}
    >
      <div className={cn("flex h-16 items-center px-4", collapsed && "justify-center px-2")}>
        <Logo showText={!collapsed} size="sm" />
      </div>

      <nav className="flex min-h-0 flex-1 flex-col space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex min-w-0 items-center gap-3 rounded-2xl border border-transparent px-3 py-3 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-[var(--brand-900)] text-white shadow-sm shadow-[rgba(10,60,110,0.2)] dark:bg-[var(--brand-600)] dark:text-white"
                  : "text-text-secondary hover:bg-[var(--brand-900)] hover:text-white hover:shadow-sm hover:shadow-[rgba(10,60,110,0.2)] dark:hover:bg-[var(--brand-600)] dark:hover:text-white",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 shrink-0 transition-colors duration-200",
                  isActive
                    ? "text-current"
                    : "text-text-secondary group-hover:text-white dark:group-hover:text-white"
                )}
              />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        {!collapsed ? (
          <Link
            href="/generate"
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--brand-900)] to-[var(--brand-600)] px-3 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:from-[var(--brand-600)] hover:to-[var(--brand-500)] hover:shadow-lg hover:shadow-[rgba(10,60,110,0.22)]"
          >
            <Sparkles className="h-4 w-4" />
            Nueva publicación
          </Link>
        ) : (
          <Link
            href="/generate"
            className="flex items-center justify-center rounded-2xl bg-gradient-to-r from-[var(--brand-900)] to-[var(--brand-600)] p-3 text-white shadow-sm transition-all hover:from-[var(--brand-600)] hover:to-[var(--brand-500)] hover:shadow-lg hover:shadow-[rgba(10,60,110,0.22)]"
            title="Nueva publicación"
          >
            <Sparkles className="h-4 w-4" />
          </Link>
        )}
        {onToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="mt-3 flex w-full items-center justify-center rounded-2xl border border-border bg-card px-3 py-3 text-sm font-semibold text-[var(--text-secondary)] transition-all hover:border-[var(--brand-900)] hover:bg-[var(--brand-900)] hover:text-white hover:shadow-sm hover:shadow-[rgba(10,60,110,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:bg-[var(--surface)] dark:hover:border-[var(--brand-600)] dark:hover:bg-[var(--brand-600)] dark:hover:text-white"
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
          </button>
        )}
      </div>
    </aside>
  );
}
