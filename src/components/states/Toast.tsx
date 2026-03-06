"use client";

import { useEffect, useRef, useState, createContext, useContext, useCallback } from "react";
import { CheckCircle, AlertTriangle, Info, XCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextValue {
  toast: (item: Omit<ToastItem, "id">) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const icons: Record<ToastVariant, React.ComponentType<{ className?: string }>> = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const variantStyles: Record<ToastVariant, string> = {
  success: "border-[var(--ux-success)]/30 bg-[var(--ux-success)]/8",
  error: "border-[var(--ux-danger)]/30 bg-[var(--ux-danger)]/8",
  warning: "border-[var(--ux-warning)]/30 bg-[var(--ux-warning)]/8",
  info: "border-[var(--ux-accent)]/30 bg-[var(--ux-accent)]/8",
};

const iconStyles: Record<ToastVariant, string> = {
  success: "text-[var(--ux-success)]",
  error: "text-[var(--ux-danger)]",
  warning: "text-[var(--ux-warning)]",
  info: "text-[var(--ux-accent)]",
};

function ToastItem({ item, onDismiss }: { item: ToastItem; onDismiss: (id: string) => void }) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const Icon = icons[item.variant];

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    timerRef.current = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss(item.id), 300);
    }, item.duration ?? 4000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [item.id, item.duration, onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex items-start gap-3 rounded-lg border px-4 py-3 shadow-[0_4px_16px_var(--ux-shadow)] transition-all duration-300 w-80 bg-[var(--ux-surface)]",
        variantStyles[item.variant],
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      )}
    >
      <Icon className={cn("h-5 w-5 mt-0.5 shrink-0", iconStyles[item.variant])} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[var(--ux-text)]">{item.title}</p>
        {item.description && (
          <p className="text-xs text-[var(--ux-text-muted)] mt-0.5">{item.description}</p>
        )}
      </div>
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(() => onDismiss(item.id), 300);
        }}
        className="rounded p-0.5 hover:bg-[var(--ux-surface-2)] text-[var(--ux-text-muted)] shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ux-ring)]"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((item: Omit<ToastItem, "id">) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { ...item, id }]);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-label="Notifications"
        className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} item={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
