import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, showText = true, size = "md" }: LogoProps) {
  const sizes = { sm: "h-6 w-6", md: "h-8 w-8", lg: "h-10 w-10" };
  const textSizes = { sm: "text-base", md: "text-xl", lg: "text-2xl" };

  return (
    <Link href="/" className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "flex items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 font-bold text-white shadow-lg shadow-indigo-500/20",
          sizes[size],
          size === "sm" ? "text-xs" : "text-sm"
        )}
      >
        LD
      </div>
      {showText && (
        <span className={cn("font-semibold tracking-tight", textSizes[size])}>
          linkdev
        </span>
      )}
    </Link>
  );
}
