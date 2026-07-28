import Link from "next/link";
import { Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  accentClassName?: string;
}

export function Logo({ className, showText = true, size = "md", accentClassName }: LogoProps) {
  const iconSizes = { sm: "h-9 w-9", md: "h-11 w-11", lg: "h-14 w-14" };
  const textSizes = { sm: "text-base", md: "text-lg", lg: "text-xl" };
  const accentStyles = accentClassName ?? "text-[var(--brand-600)] dark:text-[var(--brand-300)]";

  return (
    <Link
      href="/"
      aria-label="Linkdev home"
      className={cn("inline-flex items-center gap-3 whitespace-nowrap transition-opacity hover:opacity-95", className)}
    >
      <span
        className={cn(
          "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5 dark:ring-white/10",
          iconSizes[size]
        )}
      >
        <span className="absolute inset-0 bg-gradient-to-br from-[#0A3C6E] via-[#12599E] to-[#1783C1]" />
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.34),transparent_35%)]" />
        <span className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.16),transparent_55%)]" />
        <Link2 className="relative h-1/2 w-1/2 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]" strokeWidth={2.5} />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-white/90 shadow-[0_0_0_4px_rgba(255,255,255,0.14)]" />
      </span>

      {showText && (
        <span
          className={cn(
            "font-bold tracking-[-0.04em] text-current",
            textSizes[size]
          )}
        >
          Link<span className={accentStyles}>dev</span>
        </span>
      )}
    </Link>
  );
}
