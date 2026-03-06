"use client";

import { useState, useEffect } from "react";
import { X, ChevronDown, Search, Save, FolderOpen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import type { IncidentStatus, IncidentSeverity, Incident } from "@/data/incidents";
import { format } from "date-fns";

export interface FilterState {
  statuses: IncidentStatus[];
  severities: IncidentSeverity[];
  services: string[];
  search: string;
  dateFrom: string;
  dateTo: string;
}

const EMPTY_FILTER: FilterState = {
  statuses: [],
  severities: [],
  services: [],
  search: "",
  dateFrom: "",
  dateTo: "",
};

const ALL_STATUSES: IncidentStatus[] = ["open", "investigating", "resolved", "closed"];
const ALL_SEVERITIES: IncidentSeverity[] = ["critical", "high", "medium", "low"];

interface FilterBuilderProps {
  data: Incident[];
  filters: FilterState;
  onChange: (f: FilterState) => void;
}

interface Preset {
  id: string;
  name: string;
  filters: FilterState;
}

function MultiSelect<T extends string>({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: T[];
  selected: T[];
  onToggle: (v: T) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-9 items-center gap-2 rounded-md border px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ux-ring)]",
          selected.length > 0
            ? "border-[var(--ux-accent)] bg-[var(--ux-accent)]/5 text-[var(--ux-accent)]"
            : "border-[var(--ux-border)] bg-[var(--ux-surface)] text-[var(--ux-text-muted)] hover:bg-[var(--ux-surface-2)]"
        )}
      >
        {label}
        {selected.length > 0 && (
          <span className="rounded-full bg-[var(--ux-accent)] text-[var(--ux-accent-foreground)] text-xs px-1.5 py-0.5">
            {selected.length}
          </span>
        )}
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute left-0 top-10 z-20 w-48 rounded-md border border-[var(--ux-border)] bg-[var(--ux-surface)] shadow-[0_8px_24px_var(--ux-shadow)] py-1">
            {options.map((opt) => (
              <label
                key={opt}
                className="flex items-center gap-2 px-3 py-2 hover:bg-[var(--ux-surface-2)] cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(opt)}
                  onChange={() => onToggle(opt)}
                  className="accent-[var(--ux-accent)]"
                />
                <span className="text-sm capitalize text-[var(--ux-text)]">{opt}</span>
              </label>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function applyFilters(data: Incident[], filters: FilterState): Incident[] {
  return data.filter((row) => {
    if (filters.statuses.length > 0 && !filters.statuses.includes(row.status)) return false;
    if (filters.severities.length > 0 && !filters.severities.includes(row.severity)) return false;
    if (filters.services.length > 0 && !filters.services.includes(row.service)) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const match =
        row.id.toLowerCase().includes(q) ||
        row.summary.toLowerCase().includes(q) ||
        row.service.toLowerCase().includes(q) ||
        row.requestId.toLowerCase().includes(q) ||
        row.tags.some((t) => t.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (filters.dateFrom) {
      if (new Date(row.createdAt) < new Date(filters.dateFrom)) return false;
    }
    if (filters.dateTo) {
      if (new Date(row.createdAt) > new Date(filters.dateTo)) return false;
    }
    return true;
  });
}

export function FilterBuilder({ data, filters, onChange }: FilterBuilderProps) {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [presetName, setPresetName] = useState("");
  const [presetsOpen, setPresetsOpen] = useState(false);

  const services = Array.from(new Set(data.map((d) => d.service))).sort();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ux-kit-filter-presets");
      if (stored) setPresets(JSON.parse(stored) as Preset[]);
    } catch {
      /* ignore */
    }
  }, []);

  const savePreset = () => {
    const id = `preset-${Date.now()}`;
    const newPreset: Preset = { id, name: presetName || "Untitled preset", filters };
    const next = [...presets, newPreset];
    setPresets(next);
    try {
      localStorage.setItem("ux-kit-filter-presets", JSON.stringify(next));
    } catch {
      /* ignore */
    }
    setSaveDialogOpen(false);
    setPresetName("");
  };

  const deletePreset = (id: string) => {
    const next = presets.filter((p) => p.id !== id);
    setPresets(next);
    try {
      localStorage.setItem("ux-kit-filter-presets", JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const loadPreset = (preset: Preset) => {
    onChange(preset.filters);
    setPresetsOpen(false);
  };

  const toggle = <T extends string>(arr: T[], val: T): T[] =>
    arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

  const activeChips: { label: string; onRemove: () => void }[] = [
    ...filters.statuses.map((s) => ({
      label: `Status: ${s}`,
      onRemove: () => onChange({ ...filters, statuses: filters.statuses.filter((v) => v !== s) }),
    })),
    ...filters.severities.map((s) => ({
      label: `Severity: ${s}`,
      onRemove: () => onChange({ ...filters, severities: filters.severities.filter((v) => v !== s) }),
    })),
    ...filters.services.map((s) => ({
      label: `Service: ${s}`,
      onRemove: () => onChange({ ...filters, services: filters.services.filter((v) => v !== s) }),
    })),
    ...(filters.dateFrom
      ? [{ label: `From: ${format(new Date(filters.dateFrom), "MMM d")}`, onRemove: () => onChange({ ...filters, dateFrom: "" }) }]
      : []),
    ...(filters.dateTo
      ? [{ label: `To: ${format(new Date(filters.dateTo), "MMM d")}`, onRemove: () => onChange({ ...filters, dateTo: "" }) }]
      : []),
  ];

  const hasFilters =
    activeChips.length > 0 || filters.search.length > 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Input
          leftIcon={<Search className="h-4 w-4" />}
          placeholder="Search incidents..."
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="max-w-xs"
        />

        <MultiSelect
          label="Status"
          options={ALL_STATUSES}
          selected={filters.statuses}
          onToggle={(v) => onChange({ ...filters, statuses: toggle(filters.statuses, v) })}
        />

        <MultiSelect
          label="Severity"
          options={ALL_SEVERITIES}
          selected={filters.severities}
          onToggle={(v) => onChange({ ...filters, severities: toggle(filters.severities, v) })}
        />

        <MultiSelect
          label="Service"
          options={services}
          selected={filters.services}
          onToggle={(v) => onChange({ ...filters, services: toggle(filters.services, v) })}
        />

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => onChange({ ...filters, dateFrom: e.target.value })}
            className="h-9 rounded-md border border-[var(--ux-border)] bg-[var(--ux-surface)] px-2 text-sm text-[var(--ux-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ux-ring)]"
            aria-label="Date from"
          />
          <span className="text-sm text-[var(--ux-text-muted)]">–</span>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => onChange({ ...filters, dateTo: e.target.value })}
            className="h-9 rounded-md border border-[var(--ux-border)] bg-[var(--ux-surface)] px-2 text-sm text-[var(--ux-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ux-ring)]"
            aria-label="Date to"
          />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPresetsOpen((v) => !v)}
            >
              <FolderOpen className="h-3.5 w-3.5" />
              Presets
              {presets.length > 0 && (
                <span className="ml-1 rounded-full bg-[var(--ux-accent)] text-[var(--ux-accent-foreground)] text-xs px-1.5 py-0.5">
                  {presets.length}
                </span>
              )}
            </Button>
            {presetsOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setPresetsOpen(false)} aria-hidden="true" />
                <div className="absolute right-0 top-10 z-20 w-56 rounded-md border border-[var(--ux-border)] bg-[var(--ux-surface)] shadow-[0_8px_24px_var(--ux-shadow)] py-1">
                  {presets.length === 0 ? (
                    <p className="px-3 py-4 text-center text-sm text-[var(--ux-text-muted)]">No saved presets</p>
                  ) : (
                    presets.map((preset) => (
                      <div key={preset.id} className="flex items-center gap-1 px-2 py-1 hover:bg-[var(--ux-surface-2)]">
                        <button
                          className="flex-1 text-left text-sm text-[var(--ux-text)] py-1 px-1"
                          onClick={() => loadPreset(preset)}
                        >
                          {preset.name}
                        </button>
                        <button
                          className="p-1 rounded hover:bg-[var(--ux-border)] text-[var(--ux-text-muted)]"
                          onClick={() => deletePreset(preset.id)}
                          aria-label="Delete preset"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setSaveDialogOpen(true)}
            disabled={!hasFilters}
          >
            <Save className="h-3.5 w-3.5" />
            Save preset
          </Button>
        </div>
      </div>

      {activeChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {activeChips.map((chip) => (
            <span
              key={chip.label}
              className="flex items-center gap-1.5 rounded-full border border-[var(--ux-accent)]/30 bg-[var(--ux-accent)]/10 px-2.5 py-1 text-xs font-medium text-[var(--ux-accent)]"
            >
              {chip.label}
              <button
                onClick={chip.onRemove}
                className="rounded-full hover:bg-[var(--ux-accent)]/20 p-0.5"
                aria-label={`Remove ${chip.label} filter`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <button
            onClick={() => onChange(EMPTY_FILTER)}
            className="text-xs text-[var(--ux-text-muted)] hover:text-[var(--ux-danger)] transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {saveDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-[var(--ux-text)]/30 backdrop-blur-sm" onClick={() => setSaveDialogOpen(false)} aria-hidden="true" />
          <div className="relative w-full max-w-sm rounded-xl border border-[var(--ux-border)] bg-[var(--ux-surface)] p-6 shadow-[0_20px_60px_var(--ux-shadow)]">
            <h3 className="text-base font-semibold text-[var(--ux-text)]">Save filter preset</h3>
            <p className="mt-1 text-sm text-[var(--ux-text-muted)]">Give this filter configuration a name to reuse it later.</p>
            <div className="mt-4">
              <Input
                placeholder="Preset name"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && savePreset()}
                autoFocus
              />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setSaveDialogOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={savePreset}>
                Save preset
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
