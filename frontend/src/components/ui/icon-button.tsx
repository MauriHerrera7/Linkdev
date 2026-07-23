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
        "inline-flex h-10 w-10 items-center justify-center rounded-full border border-transparent bg-[var(--card)] text-[var(--text-secondary)] transition-all duration-200 hover:border-[var(--brand-300)] hover:bg-[var(--brand-100)] hover:text-[var(--brand-900)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:hover:bg-white/10 dark:hover:text-[var(--text)]",
        active && "border-[var(--brand-900)] bg-[var(--brand-900)] text-white shadow-sm shadow-[rgba(10,60,110,0.18)] hover:bg-[var(--brand-600)] dark:border-[var(--brand-300)] dark:bg-[var(--brand-600)] dark:hover:bg-[var(--brand-500)]",
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
