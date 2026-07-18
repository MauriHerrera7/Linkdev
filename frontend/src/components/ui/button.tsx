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
        default: "bg-[var(--brand-600)] text-[var(--brand-100)] shadow-sm shadow-[rgba(51,102,255,0.15)] hover:bg-[var(--brand-500)] active:scale-[0.98]",
        destructive: "bg-[var(--destructive)] text-[var(--destructive-foreground)] hover:bg-[#d72a46]",
        outline: "border border-[var(--brand-600)] bg-[var(--card)] text-[var(--brand-600)] hover:bg-[var(--brand-100)]",
        secondary: "bg-[var(--brand-300)] text-[var(--brand-900)] hover:bg-[var(--brand-100)]",
        ghost: "bg-transparent text-[var(--brand-900)] hover:bg-[var(--brand-100)]",
        link: "text-[var(--brand-600)] underline-offset-4 hover:underline",
        gradient:
          "bg-[var(--brand-600)] text-[var(--brand-100)] shadow-lg shadow-[rgba(51,102,255,0.25)] hover:bg-[var(--brand-500)] active:scale-[0.98]",
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
