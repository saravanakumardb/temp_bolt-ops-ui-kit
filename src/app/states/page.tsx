"use client";

import { useState } from "react";
import { TableSkeleton, KpiSkeleton, CardSkeleton } from "@/components/states/SkeletonLoader";
import { EmptyState } from "@/components/states/EmptyState";
import { ErrorBanner } from "@/components/states/ErrorBanner";
import { ConfirmDialog } from "@/components/states/ConfirmDialog";
import { useToast } from "@/components/states/Toast";
import { Button } from "@/components/ui/Button";
import { CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, Info, Circle as XCircle, Trash2, RefreshCw } from "lucide-react";

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-[var(--ux-text)]">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-[var(--ux-text-muted)]">{description}</p>}
      </div>
      {children}
    </section>
  );
}

export default function StatesPage() {
  const { toast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [showError, setShowError] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      setIsRetrying(false);
      setShowError(false);
      toast({ variant: "success", title: "Reconnected", description: "Data loaded successfully." });
    }, 1500);
  };

  return (
    <div className="max-w-4xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-[var(--ux-text)]">States Gallery</h1>
        <p className="mt-1 text-sm text-[var(--ux-text-muted)]">
          Loading skeletons, empty states, error banners, toasts, and destructive dialogs.
        </p>
      </div>

      <Section title="Skeleton Loading" description="Animate placeholders while data loads.">
        <div className="flex flex-col gap-4">
          <KpiSkeleton />
          <CardSkeleton />
          <TableSkeleton />
        </div>
      </Section>

      <Section title="Empty States" description="Clear visual feedback when lists are empty.">
        <div className="grid gap-4 sm:grid-cols-2">
          {(["default", "search", "filtered"] as const).map((type) => (
            <div key={type} className="rounded-xl border border-[var(--ux-border)] bg-[var(--ux-surface)]">
              <EmptyState type={type} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Inline Error Banners" description="Non-blocking error feedback with optional retry.">
        <div className="flex flex-col gap-3">
          {showError ? (
            <ErrorBanner
              title="Failed to load webhook logs"
              message="Unable to connect to the API. The service may be temporarily unavailable."
              onRetry={isRetrying ? undefined : handleRetry}
              dismissible
            />
          ) : (
            <div className="flex items-center gap-3 rounded-lg border border-[var(--ux-success)]/30 bg-[var(--ux-success)]/8 px-4 py-3">
              <CheckCircle className="h-5 w-5 text-[var(--ux-success)]" />
              <span className="text-sm text-[var(--ux-text)]">Reconnected successfully.</span>
              <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setShowError(true)}>
                <RefreshCw className="h-3.5 w-3.5" />
                Reset demo
              </Button>
            </div>
          )}
          <ErrorBanner
            message="Rate limit exceeded. Requests will resume in 60 seconds."
            dismissible={false}
          />
        </div>
      </Section>

      <Section title="Toast Notifications" description="Ephemeral feedback messages in the corner.">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast({ variant: "success", title: "Changes saved", description: "Your settings have been updated." })}
          >
            <CheckCircle className="h-4 w-4 text-[var(--ux-success)]" />
            Success toast
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast({ variant: "error", title: "Action failed", description: "Could not complete the request." })}
          >
            <XCircle className="h-4 w-4 text-[var(--ux-danger)]" />
            Error toast
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast({ variant: "warning", title: "Degraded performance", description: "Response times are elevated." })}
          >
            <AlertTriangle className="h-4 w-4 text-[var(--ux-warning)]" />
            Warning toast
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast({ variant: "info", title: "Scheduled maintenance", description: "Downtime window: 02:00–04:00 UTC." })}
          >
            <Info className="h-4 w-4 text-[var(--ux-accent)]" />
            Info toast
          </Button>
        </div>
      </Section>

      <Section title="Destructive Confirm Dialog" description="Gate irreversible actions behind an explicit confirmation.">
        <div className="flex items-center gap-3">
          <Button
            variant="danger"
            onClick={() => setConfirmOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
            Delete selected incidents
          </Button>
          <p className="text-sm text-[var(--ux-text-muted)]">Opens a modal confirmation dialog</p>
        </div>
      </Section>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete 12 incidents?"
        description="This action cannot be undone. All selected incidents and their associated notes will be permanently removed."
        confirmLabel="Delete incidents"
        onConfirm={() => {
          setConfirmOpen(false);
          toast({ variant: "success", title: "Incidents deleted", description: "12 incidents were removed." });
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
