"use client";

import { useState, useRef, useMemo } from "react";
import { DataTable } from "@/components/DataTable";
import { DetailsDrawer } from "@/components/DetailsDrawer";
import { incidents } from "@/data/incidents";
import type { Incident } from "@/data/incidents";

export default function TablePage() {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const data = useMemo(() => incidents, []);

  return (
    <div className="max-w-full px-6 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[var(--ux-text)]">DataTable</h1>
        <p className="mt-1 text-sm text-[var(--ux-text-muted)]">
          {data.length} incidents — click a row to open details drawer. Use column header arrows to sort, checkboxes to select, and the row menu for quick actions.
        </p>
      </div>

      <DataTable
        data={data}
        onRowClick={(row) => setSelectedIncident(row)}
      />

      <DetailsDrawer
        incident={selectedIncident}
        triggerRef={triggerRef}
        onClose={() => setSelectedIncident(null)}
      />
    </div>
  );
}
