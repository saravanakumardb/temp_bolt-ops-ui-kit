"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "danger" | "secondary";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ux-ring)]",
          variant === "default" &&
            "bg-[var(--ux-accent)] text-[var(--ux-accent-foreground)] hover:opacity-90 active:scale-[0.98]",
          variant === "outline" &&
            "border border-[var(--ux-border)] bg-transparent text-[var(--ux-text)] hover:bg-[var(--ux-surface-2)]",
          variant === "ghost" &&
            "bg-transparent text-[var(--ux-text)] hover:bg-[var(--ux-surface-2)]",
          variant === "danger" &&
            "bg-[var(--ux-danger)] text-[var(--ux-accent-foreground)] hover:opacity-90",
          variant === "secondary" &&
            "bg-[var(--ux-surface-2)] text-[var(--ux-text)] hover:bg-[var(--ux-border)]",
          size === "sm" && "h-7 px-3 text-xs",
          size === "md" && "h-9 px-4 text-sm",
          size === "lg" && "h-11 px-6 text-base",
          size === "icon" && "h-9 w-9",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
