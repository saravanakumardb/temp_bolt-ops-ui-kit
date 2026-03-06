"use client";

import { KpiCard } from "@/components/KpiCard";
import { ChartPlaceholder } from "@/components/ChartPlaceholder";
import { incidents } from "@/data/incidents";
import {
  AlertCircle,
  CheckCircle,
  Activity,
  Clock,
  TrendingUp,
  Zap,
} from "lucide-react";

function computeKpis() {
  const total = incidents.length;
  const open = incidents.filter((i) => i.status === "open").length;
  const resolved = incidents.filter((i) => i.status === "resolved" || i.status === "closed").length;
  const critical = incidents.filter((i) => i.severity === "critical").length;
  const investigating = incidents.filter((i) => i.status === "investigating").length;

  const resolutionRate = Math.round((resolved / total) * 100);

  return { total, open, resolved, critical, investigating, resolutionRate };
}

export default function KpiPage() {
  const kpis = computeKpis();

  return (
    <div className="max-w-5xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[var(--ux-text)]">KPI Cards</h1>
        <p className="mt-1 text-sm text-[var(--ux-text-muted)]">
          Metric cards with trend indicators and chart placeholders. Data derived from the 100-row incident mock.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 mb-8">
        <KpiCard
          title="Total Incidents"
          value={kpis.total}
          trend={{ value: 12, label: "vs last week", direction: "up" }}
          icon={Activity}
          className="col-span-2 sm:col-span-1"
        />
        <KpiCard
          title="Open"
          value={kpis.open}
          subtitle="Needs attention"
          trend={{ value: 3, label: "new today", direction: "up" }}
          icon={AlertCircle}
          variant="danger"
        />
        <KpiCard
          title="Investigating"
          value={kpis.investigating}
          subtitle="In progress"
          trend={{ value: 0, label: "unchanged", direction: "neutral" }}
          icon={Clock}
          variant="warning"
        />
        <KpiCard
          title="Resolved"
          value={kpis.resolved}
          trend={{ value: 8, label: "vs yesterday", direction: "up" }}
          icon={CheckCircle}
          variant="success"
        />
        <KpiCard
          title="Critical"
          value={kpis.critical}
          subtitle="P0 severity"
          trend={{ value: 2, label: "decrease", direction: "down" }}
          icon={Zap}
          variant="danger"
        />
        <KpiCard
          title="Resolution Rate"
          value={`${kpis.resolutionRate}%`}
          trend={{ value: 5, label: "improvement", direction: "up" }}
          icon={TrendingUp}
          variant="success"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        <ChartPlaceholder type="line" title="Incidents over time" height="h-48" />
        <ChartPlaceholder type="bar" title="By severity" height="h-48" />
        <ChartPlaceholder type="pie" title="Status distribution" height="h-48" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ChartPlaceholder type="area" title="Resolution rate trend" height="h-56" />
        <div className="rounded-xl border border-[var(--ux-border)] bg-[var(--ux-surface)] p-5">
          <h3 className="text-sm font-semibold text-[var(--ux-text)] mb-4">Top services by incidents</h3>
          <div className="flex flex-col gap-3">
            {Object.entries(
              incidents.reduce<Record<string, number>>((acc, i) => {
                acc[i.service] = (acc[i.service] ?? 0) + 1;
                return acc;
              }, {})
            )
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([service, count]) => {
                const pct = Math.round((count / incidents.length) * 100);
                return (
                  <div key={service}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-[var(--ux-text)]">{service}</span>
                      <span className="text-xs text-[var(--ux-text-muted)]">{count} incidents</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[var(--ux-surface-2)] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[var(--ux-accent)]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
