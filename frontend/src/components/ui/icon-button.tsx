import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  active?: boolean;
  label?: string;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon: Icon, className, active = false, label, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full border border-transparent text-[var(--foreground)] transition-colors duration-200 hover:bg-[rgba(51,102,255,0.08)] hover:border-[rgba(51,102,255,0.16)] active:bg-[rgba(51,102,255,0.12)]",
        active && "bg-[var(--brand-600)] text-[var(--brand-100)] hover:bg-[var(--brand-500)]",
        className
      )}
      {...props}
    >
      <Icon className="h-5 w-5" />
    </button>
  )
);
IconButton.displayName = "IconButton";

export { IconButton };