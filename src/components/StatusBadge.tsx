"use client";

import { Badge } from "@/components/ui/Badge";
import type { IncidentStatus, IncidentSeverity } from "@/data/incidents";

export function StatusBadge({ status }: { status: IncidentStatus }) {
  const variants = {
    open: "danger",
    investigating: "warning",
    resolved: "success",
    closed: "muted",
  } as const;

  return <Badge variant={variants[status]}>{status}</Badge>;
}

export function SeverityBadge({ severity }: { severity: IncidentSeverity }) {
  const variants = {
    critical: "danger",
    high: "warning",
    medium: "default",
    low: "muted",
  } as const;

  return <Badge variant={variants[severity]}>{severity}</Badge>;
}
