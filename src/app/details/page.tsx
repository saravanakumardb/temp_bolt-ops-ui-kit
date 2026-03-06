"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { DetailsDrawer } from "@/components/DetailsDrawer";
import { Badge } from "@/components/ui/Badge";
import { incidents } from "@/data/incidents";
import type { Incident } from "@/data/incidents";
import { PanelRight, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { format } from "date-fns";

export default function DetailsPage() {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const triggerRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const demoIncidents = incidents.slice(0, 6);

  return (
    <div className="max-w-4xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[var(--ux-text)]">Details Drawer</h1>
        <p className="mt-1 text-sm text-[var(--ux-text-muted)]">
          Right-side drawer with tabbed content. Click any row to open. Esc to close — focus returns to the trigger.
        </p>
      </div>

      <div className="rounded-xl border border-[var(--ux-border)] bg-[var(--ux-surface)] overflow-hidden mb-6">
        <div className="border-b border-[var(--ux-border)] bg-[var(--ux-surface-2)] px-4 py-3 flex items-center gap-2">
          <PanelRight className="h-4 w-4 text-[var(--ux-text-muted)]" />
          <span className="text-sm font-semibold text-[var(--ux-text)]">Incidents</span>
        </div>
        <div className="divide-y divide-[var(--ux-border)]">
          {demoIncidents.map((incident) => {
            const statusIcon = {
              open: AlertCircle,
              investigating: Clock,
              resolved: CheckCircle,
              closed: CheckCircle,
            }[incident.status];
            const StatusIcon = statusIcon;

            const statusColor = {
              open: "text-[var(--ux-danger)]",
              investigating: "text-[var(--ux-warning)]",
              resolved: "text-[var(--ux-success)]",
              closed: "text-[var(--ux-text-muted)]",
            }[incident.status];

            return (
              <div
                key={incident.id}
                className="flex items-center gap-4 px-4 py-3.5 hover:bg-[var(--ux-surface-2)] transition-colors"
              >
                <StatusIcon className={`h-4 w-4 shrink-0 ${statusColor}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium text-[var(--ux-text)]">{incident.id}</span>
                    <Badge
                      variant={incident.severity === "critical" ? "danger" : incident.severity === "high" ? "warning" : "muted"}
                    >
                      {incident.severity}
                    </Badge>
                  </div>
                  <p className="text-xs text-[var(--ux-text-muted)] truncate">{incident.summary}</p>
                </div>
                <div className="text-xs text-[var(--ux-text-muted)] shrink-0 hidden sm:block">
                  {format(new Date(incident.createdAt), "MMM d, HH:mm")}
                </div>
                <Button
                  ref={(el) => {
                    if (el) triggerRefs.current.set(incident.id, el);
                  }}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    triggerRef.current = triggerRefs.current.get(incident.id) ?? null;
                    setSelectedIncident(incident);
                  }}
                >
                  <PanelRight className="h-3.5 w-3.5" />
                  Details
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-[var(--ux-border)] bg-[var(--ux-surface-2)] p-5">
        <h2 className="text-sm font-semibold text-[var(--ux-text)] mb-3">Accessibility</h2>
        <ul className="space-y-2 text-sm text-[var(--ux-text-muted)]">
          <li className="flex items-start gap-2">
            <span className="text-[var(--ux-success)] mt-0.5">✓</span>
            Focus moves to close button when drawer opens
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--ux-success)] mt-0.5">✓</span>
            Pressing Esc closes the drawer and returns focus to the triggering button
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--ux-success)] mt-0.5">✓</span>
            Backdrop click also closes the drawer
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--ux-success)] mt-0.5">✓</span>
            Notes tab persists to localStorage per incident
          </li>
        </ul>
      </div>

      <DetailsDrawer
        incident={selectedIncident}
        triggerRef={triggerRef}
        onClose={() => setSelectedIncident(null)}
      />
    </div>
  );
}
