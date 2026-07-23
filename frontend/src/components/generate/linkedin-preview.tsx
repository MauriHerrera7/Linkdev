"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { mockUser } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface LinkedInPreviewProps {
  content: string;
  className?: string;
}

export function LinkedInPreview({ content, className }: LinkedInPreviewProps) {
  const initials = mockUser.name.split(" ").map((n) => n[0]).join("");

  return (
    <div className={cn("rounded-xl border border-border bg-card", className)}>
      <div className="border-b border-border px-4 py-3">
        <p className="text-xs font-medium text-muted-foreground">Vista previa · LinkedIn</p>
      </div>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold">{mockUser.name}</p>
            <p className="text-xs text-muted-foreground">
              {mockUser.profession} · linkdev
            </p>
            <p className="text-xs text-muted-foreground">Ahora · 🌐</p>
          </div>
        </div>

        <div className="mt-3">
          {content ? (
            <p className="whitespace-pre-line text-sm leading-relaxed">
              {content.length > 300 && !content.includes("\n")
                ? content.slice(0, 300) + "..."
                : content}
            </p>
          ) : (
            <p className="text-sm italic text-muted-foreground">
              Tu publicación aparecerá acá...
            </p>
          )}
          {content.length > 300 && (
            <Button
              type="button"
              variant="link"
              className="mt-1 h-auto p-0 text-sm font-semibold text-[var(--brand-900)] hover:text-[var(--brand-600)] dark:text-[var(--brand-100)] dark:hover:text-white"
            >
              ...ver más
            </Button>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
          <span>👍 Me gusta</span>
          <span>💬 Comentar</span>
          <span>🔄 Compartir</span>
          <span>📤 Enviar</span>
        </div>
      </div>
    </div>
  );
}
