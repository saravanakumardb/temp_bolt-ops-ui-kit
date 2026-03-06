"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "muted";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        variant === "default" && "bg-[var(--ux-accent)] text-[var(--ux-accent-foreground)]",
        variant === "success" && "bg-[var(--ux-success)]/15 text-[var(--ux-success)]",
        variant === "warning" && "bg-[var(--ux-warning)]/15 text-[var(--ux-warning)]",
        variant === "danger" && "bg-[var(--ux-danger)]/15 text-[var(--ux-danger)]",
        variant === "muted" && "bg-[var(--ux-surface-2)] text-[var(--ux-text-muted)]",
        className
      )}
    >
      {children}
    </span>
  );
}
