"use client";

import { useState, useMemo } from "react";
import { FilterBuilder, applyFilters } from "@/components/FilterBuilder";
import type { FilterState } from "@/components/FilterBuilder";
import { DataTable } from "@/components/DataTable";
import { EmptyState } from "@/components/states/EmptyState";
import { DetailsDrawer } from "@/components/DetailsDrawer";
import { incidents } from "@/data/incidents";
import type { Incident } from "@/data/incidents";

const EMPTY_FILTER: FilterState = {
  statuses: [],
  severities: [],
  services: [],
  search: "",
  dateFrom: "",
  dateTo: "",
};

export default function FiltersPage() {
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTER);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const filtered = useMemo(() => applyFilters(incidents, filters), [filters]);

  return (
    <div className="max-w-full px-6 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[var(--ux-text)]">Filter Builder</h1>
        <p className="mt-1 text-sm text-[var(--ux-text-muted)]">
          Faceted filters with multi-select, date range, search, active chips, and localStorage presets.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="rounded-xl border border-[var(--ux-border)] bg-[var(--ux-surface)] p-4">
          <FilterBuilder
            data={incidents}
            filters={filters}
            onChange={setFilters}
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            type="filtered"
            action={{ label: "Clear filters", onClick: () => setFilters(EMPTY_FILTER) }}
          />
        ) : (
          <div>
            <p className="text-sm text-[var(--ux-text-muted)] mb-3">
              Showing <span className="font-semibold text-[var(--ux-text)]">{filtered.length}</span> of{" "}
              {incidents.length} incidents
            </p>
            <DataTable data={filtered} onRowClick={setSelectedIncident} />
          </div>
        )}
      </div>

      <DetailsDrawer
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
      />
    </div>
  );
}
