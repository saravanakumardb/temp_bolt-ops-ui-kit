"use client";

import { AlertTriangle, X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useState } from "react";

interface ErrorBannerProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  dismissible?: boolean;
}

export function ErrorBanner({ title, message, onRetry, dismissible = true }: ErrorBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-lg border border-[var(--ux-danger)]/30 bg-[var(--ux-danger)]/8 px-4 py-3"
    >
      <AlertTriangle className="h-5 w-5 text-[var(--ux-danger)] mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        {title && (
          <p className="text-sm font-semibold text-[var(--ux-danger)]">{title}</p>
        )}
        <p className="text-sm text-[var(--ux-text)]">{message}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {onRetry && (
          <Button variant="ghost" size="sm" onClick={onRetry} aria-label="Retry">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        )}
        {dismissible && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss error"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
