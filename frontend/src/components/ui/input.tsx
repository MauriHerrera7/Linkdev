import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-[var(--radius-pill)] border border-[var(--input)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--foreground)] transition-all duration-200 placeholder:text-[rgba(29,45,74,0.4)] focus-visible:outline-none focus-visible:border-[var(--brand-600)] focus-visible:ring-2 focus-visible:ring-[rgba(24,119,242,0.18)] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
