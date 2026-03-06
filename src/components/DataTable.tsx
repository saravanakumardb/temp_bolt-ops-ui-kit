"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  MoreHorizontal,
  Eye,
  Code2,
  Trash2,
  Settings2,
  ChevronDownIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { StatusBadge, SeverityBadge } from "@/components/StatusBadge";
import type { Incident } from "@/data/incidents";
import { format } from "date-fns";

type SortKey = keyof Incident;
type SortDir = "asc" | "desc" | null;

interface ColumnDef {
  key: SortKey;
  label: string;
  sortable?: boolean;
  visible?: boolean;
  width?: string;
}

const DEFAULT_COLUMNS: ColumnDef[] = [
  { key: "id", label: "ID", sortable: true, visible: true, width: "w-28" },
  { key: "status", label: "Status", sortable: true, visible: true, width: "w-32" },
  { key: "severity", label: "Severity", sortable: true, visible: true, width: "w-28" },
  { key: "service", label: "Service", sortable: true, visible: true },
  { key: "summary", label: "Summary", sortable: false, visible: true },
  { key: "createdAt", label: "Created", sortable: true, visible: true, width: "w-40" },
  { key: "requestId", label: "Request ID", sortable: false, visible: true, width: "w-32" },
  { key: "tags", label: "Tags", sortable: false, visible: true, width: "w-40" },
];

const PAGE_SIZES = [10, 20, 50];

interface DataTableProps {
  data: Incident[];
  onRowClick?: (row: Incident) => void;
}

function RowMenu({
  row,
  onOpen,
}: {
  row: Incident;
  onOpen: (row: Incident) => void;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => undefined);
    setOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        aria-label="Row actions"
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 top-8 z-20 w-48 rounded-md border border-[var(--ux-border)] bg-[var(--ux-surface)] shadow-[0_8px_24px_var(--ux-shadow)] py-1">
            <button
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[var(--ux-text)] hover:bg-[var(--ux-surface-2)]"
              onClick={() => {
                onOpen(row);
                setOpen(false);
              }}
            >
              <Eye className="h-4 w-4 text-[var(--ux-text-muted)]" />
              Open details
            </button>
            <button
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[var(--ux-text)] hover:bg-[var(--ux-surface-2)]"
              onClick={() => copyToClipboard(row.requestId)}
            >
              <Copy className="h-4 w-4 text-[var(--ux-text-muted)]" />
              Copy request ID
            </button>
            <button
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[var(--ux-text)] hover:bg-[var(--ux-surface-2)]"
              onClick={() => copyToClipboard(JSON.stringify(row, null, 2))}
            >
              <Code2 className="h-4 w-4 text-[var(--ux-text-muted)]" />
              Copy JSON
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export function DataTable({ data, onRowClick }: DataTableProps) {
  const [columns, setColumns] = useState(DEFAULT_COLUMNS);
  const [sortKey, setSortKey] = useState<SortKey | null>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [colPickerOpen, setColPickerOpen] = useState(false);

  const visibleColumns = columns.filter((c) => c.visible);

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return data;
    return [...data].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const aStr = Array.isArray(av) ? av.join(",") : String(av);
      const bStr = Array.isArray(bv) ? bv.join(",") : String(bv);
      return sortDir === "asc"
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });
  }, [data, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / pageSize);
  const pageData = sorted.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : d === "desc" ? null : "asc"));
      if (sortDir === null) setSortKey(null);
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const allSelected = pageData.length > 0 && pageData.every((r) => selected.has(r.id));
  const someSelected = pageData.some((r) => selected.has(r.id));

  const toggleAll = () => {
    if (allSelected) {
      const next = new Set(selected);
      pageData.forEach((r) => next.delete(r.id));
      setSelected(next);
    } else {
      const next = new Set(selected);
      pageData.forEach((r) => next.add(r.id));
      setSelected(next);
    }
  };

  const toggleRow = useCallback(
    (id: string) => {
      const next = new Set(selected);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      setSelected(next);
    },
    [selected]
  );

  const toggleExpand = (id: string) => {
    const next = new Set(expanded);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpanded(next);
  };

  const renderCell = (row: Incident, col: ColumnDef) => {
    switch (col.key) {
      case "status":
        return <StatusBadge status={row.status} />;
      case "severity":
        return <SeverityBadge severity={row.severity} />;
      case "createdAt":
        return (
          <span className="text-xs text-[var(--ux-text-muted)]">
            {format(new Date(row.createdAt), "MMM d, HH:mm")}
          </span>
        );
      case "requestId":
        return (
          <span className="font-mono text-xs text-[var(--ux-text-muted)]">{row.requestId}</span>
        );
      case "tags":
        return (
          <div className="flex flex-wrap gap-1">
            {row.tags.map((t) => (
              <span
                key={t}
                className="rounded bg-[var(--ux-surface-2)] px-1.5 py-0.5 text-xs text-[var(--ux-text-muted)]"
              >
                {t}
              </span>
            ))}
          </div>
        );
      case "summary":
        return (
          <span className="line-clamp-1 text-sm text-[var(--ux-text)]">{row.summary}</span>
        );
      default:
        return <span className="text-sm text-[var(--ux-text)]">{String(row[col.key])}</span>;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {selected.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-[var(--ux-accent)]/30 bg-[var(--ux-accent)]/5 px-4 py-2.5">
          <span className="text-sm font-medium text-[var(--ux-accent)]">
            {selected.size} row{selected.size !== 1 ? "s" : ""} selected
          </span>
          <div className="flex items-center gap-2 ml-2">
            <Button variant="outline" size="sm" onClick={() => setSelected(new Set())}>
              Clear
            </Button>
            <Button variant="danger" size="sm">
              <Trash2 className="h-3.5 w-3.5" />
              Delete selected
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-[var(--ux-border)] bg-[var(--ux-surface)] overflow-hidden shadow-[0_1px_4px_var(--ux-shadow)]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--ux-border)]">
          <p className="text-sm text-[var(--ux-text-muted)]">
            <span className="font-semibold text-[var(--ux-text)]">{data.length}</span> incidents
          </p>
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setColPickerOpen((v) => !v)}
              aria-label="Column visibility"
            >
              <Settings2 className="h-3.5 w-3.5" />
              Columns
              <ChevronDownIcon className="h-3.5 w-3.5" />
            </Button>
            {colPickerOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setColPickerOpen(false)}
                  aria-hidden="true"
                />
                <div className="absolute right-0 top-10 z-20 w-48 rounded-md border border-[var(--ux-border)] bg-[var(--ux-surface)] shadow-[0_8px_24px_var(--ux-shadow)] p-2">
                  {columns.map((col) => (
                    <label
                      key={col.key}
                      className="flex items-center gap-2 rounded px-2 py-1.5 hover:bg-[var(--ux-surface-2)] cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={col.visible}
                        onChange={() => {
                          setColumns((cols) =>
                            cols.map((c) =>
                              c.key === col.key ? { ...c, visible: !c.visible } : c
                            )
                          );
                        }}
                        className="accent-[var(--ux-accent)]"
                      />
                      <span className="text-sm text-[var(--ux-text)]">{col.label}</span>
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left table-auto">
            <thead className="sticky top-0 z-[1] bg-[var(--ux-surface-2)]">
              <tr className="border-b border-[var(--ux-border)]">
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected && !allSelected;
                    }}
                    onChange={toggleAll}
                    aria-label="Select all rows"
                    className="accent-[var(--ux-accent)]"
                  />
                </th>
                <th className="w-8 px-2 py-3" />
                {visibleColumns.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      "px-3 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--ux-text-muted)]",
                      col.width
                    )}
                  >
                    {col.sortable ? (
                      <button
                        className="flex items-center gap-1 hover:text-[var(--ux-text)] transition-colors"
                        onClick={() => handleSort(col.key)}
                      >
                        {col.label}
                        {sortKey === col.key ? (
                          sortDir === "asc" ? (
                            <ChevronUp className="h-3.5 w-3.5" />
                          ) : sortDir === "desc" ? (
                            <ChevronDown className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronsUpDown className="h-3.5 w-3.5 opacity-40" />
                          )
                        ) : (
                          <ChevronsUpDown className="h-3.5 w-3.5 opacity-40" />
                        )}
                      </button>
                    ) : (
                      col.label
                    )}
                  </th>
                ))}
                <th className="w-12 px-3 py-3" />
              </tr>
            </thead>
            <tbody>
              {pageData.map((row) => {
                const isSelected = selected.has(row.id);
                const isExpanded = expanded.has(row.id);
                return (
                  <>
                    <tr
                      key={row.id}
                      className={cn(
                        "border-b border-[var(--ux-border)] transition-colors cursor-pointer",
                        isSelected
                          ? "bg-[var(--ux-accent)]/5"
                          : "hover:bg-[var(--ux-surface-2)]"
                      )}
                      onClick={() => onRowClick?.(row)}
                    >
                      <td
                        className="px-4 py-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRow(row.id);
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleRow(row.id)}
                          aria-label={`Select row ${row.id}`}
                          className="accent-[var(--ux-accent)]"
                        />
                      </td>
                      <td
                        className="px-2 py-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(row.id);
                        }}
                      >
                        <button
                          className="rounded p-0.5 hover:bg-[var(--ux-border)] text-[var(--ux-text-muted)] transition-transform"
                          aria-label={isExpanded ? "Collapse row" : "Expand row"}
                        >
                          <ChevronDown
                            className={cn(
                              "h-3.5 w-3.5 transition-transform duration-150",
                              isExpanded && "rotate-180"
                            )}
                          />
                        </button>
                      </td>
                      {visibleColumns.map((col) => (
                        <td key={col.key} className="px-3 py-3">
                          {renderCell(row, col)}
                        </td>
                      ))}
                      <td
                        className="px-3 py-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <RowMenu row={row} onOpen={(r) => onRowClick?.(r)} />
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr
                        key={`${row.id}-expanded`}
                        className="border-b border-[var(--ux-border)] bg-[var(--ux-surface-2)]"
                      >
                        <td colSpan={visibleColumns.length + 3} className="px-6 py-4">
                          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            <div>
                              <p className="text-xs font-medium text-[var(--ux-text-muted)]">ID</p>
                              <p className="mt-0.5 text-sm font-mono text-[var(--ux-text)]">{row.id}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-[var(--ux-text-muted)]">Request ID</p>
                              <p className="mt-0.5 text-sm font-mono text-[var(--ux-text)]">{row.requestId}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-[var(--ux-text-muted)]">Service</p>
                              <p className="mt-0.5 text-sm text-[var(--ux-text)]">{row.service}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-[var(--ux-text-muted)]">Created</p>
                              <p className="mt-0.5 text-sm text-[var(--ux-text)]">
                                {format(new Date(row.createdAt), "PPp")}
                              </p>
                            </div>
                            <div className="col-span-2 sm:col-span-4">
                              <p className="text-xs font-medium text-[var(--ux-text-muted)]">Summary</p>
                              <p className="mt-0.5 text-sm text-[var(--ux-text)]">{row.summary}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--ux-border)]">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--ux-text-muted)]">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="h-7 rounded border border-[var(--ux-border)] bg-[var(--ux-surface)] px-2 text-xs text-[var(--ux-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ux-ring)]"
            >
              {PAGE_SIZES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[var(--ux-text-muted)]">
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
