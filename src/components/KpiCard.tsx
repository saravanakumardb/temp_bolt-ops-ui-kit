"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    label: string;
    direction: "up" | "down" | "neutral";
  };
  icon?: React.ComponentType<{ className?: string }>;
  variant?: "default" | "success" | "warning" | "danger";
  className?: string;
}

export function KpiCard({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  variant = "default",
  className,
}: KpiCardProps) {
  const trendIcon = {
    up: TrendingUp,
    down: TrendingDown,
    neutral: Minus,
  };

  const trendColor = {
    up: "text-[var(--ux-success)]",
    down: "text-[var(--ux-danger)]",
    neutral: "text-[var(--ux-text-muted)]",
  };

  const accentColor = {
    default: "bg-[var(--ux-accent)]/10 text-[var(--ux-accent)]",
    success: "bg-[var(--ux-success)]/10 text-[var(--ux-success)]",
    warning: "bg-[var(--ux-warning)]/10 text-[var(--ux-warning)]",
    danger: "bg-[var(--ux-danger)]/10 text-[var(--ux-danger)]",
  };

  const TrendIcon = trend ? trendIcon[trend.direction] : null;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-[var(--ux-border)] bg-[var(--ux-surface)] p-5 shadow-[0_1px_4px_var(--ux-shadow)] transition-shadow hover:shadow-[0_4px_16px_var(--ux-shadow)]",
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--ux-text-muted)]">
          {title}
        </p>
        {Icon && (
          <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", accentColor[variant])}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>

      <p className="text-3xl font-bold tabular-nums text-[var(--ux-text)]">{value}</p>

      {subtitle && (
        <p className="mt-0.5 text-xs text-[var(--ux-text-muted)]">{subtitle}</p>
      )}

      {trend && TrendIcon && (
        <div className={cn("flex items-center gap-1 mt-3 text-xs font-medium", trendColor[trend.direction])}>
          <TrendIcon className="h-3.5 w-3.5" />
          <span>
            {trend.value > 0 ? "+" : ""}
            {trend.value}% {trend.label}
          </span>
        </div>
      )}
    </div>
  );
}
