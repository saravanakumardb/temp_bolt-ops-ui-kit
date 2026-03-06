"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, leftIcon, ...props }, ref) => {
    if (leftIcon) {
      return (
        <div className="relative flex items-center">
          <span className="absolute left-3 text-[var(--ux-text-muted)]">{leftIcon}</span>
          <input
            ref={ref}
            className={cn(
              "h-9 w-full rounded-md border border-[var(--ux-border)] bg-[var(--ux-surface)] pl-9 pr-3 text-sm text-[var(--ux-text)] placeholder:text-[var(--ux-text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ux-ring)] transition-shadow",
              className
            )}
            {...props}
          />
        </div>
      );
    }

    return (
      <input
        ref={ref}
        className={cn(
          "h-9 w-full rounded-md border border-[var(--ux-border)] bg-[var(--ux-surface)] px-3 text-sm text-[var(--ux-text)] placeholder:text-[var(--ux-text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ux-ring)] transition-shadow",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
