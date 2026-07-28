import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--brand-900)] text-white shadow-sm shadow-[rgba(10,60,110,0.18)] hover:bg-[var(--brand-600)] active:scale-[0.98]",
        destructive: "bg-[var(--destructive)] text-white hover:bg-[#e11d48]",
        outline:
          "border border-black bg-white text-black shadow-sm shadow-[rgba(15,23,42,0.06)] hover:border-[var(--brand-600)] hover:bg-[var(--brand-100)] hover:text-black dark:border-[var(--brand-300)] dark:bg-transparent dark:text-[var(--brand-100)] dark:hover:bg-white/10",
        secondary:
          "bg-[var(--brand-100)] text-[var(--brand-900)] hover:bg-[var(--brand-300)] dark:bg-white/10 dark:text-white dark:hover:bg-white/15",
        ghost:
          "bg-transparent text-[var(--brand-900)] hover:bg-[var(--brand-100)] hover:text-[var(--brand-900)] dark:text-[var(--text)] dark:hover:bg-white/10",
        link: "text-[var(--brand-900)] underline-offset-4 hover:text-[var(--brand-600)] hover:underline dark:text-[var(--brand-100)] dark:hover:text-white",
        gradient:
          "bg-gradient-to-r from-[var(--brand-900)] to-[var(--brand-600)] text-white shadow-lg shadow-[rgba(10,60,110,0.22)] hover:from-[var(--brand-600)] hover:to-[var(--brand-500)] active:scale-[0.98]",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 rounded-full px-4 text-xs",
        lg: "h-12 rounded-full px-8 text-base",
        icon: "h-10 w-10 rounded-full p-0",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const content = loading ? (
      <span className="flex items-center gap-2">
        <Loader2 className="animate-spin" />
        <span>{children}</span>
      </span>
    ) : (
      children
    );

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {content}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
