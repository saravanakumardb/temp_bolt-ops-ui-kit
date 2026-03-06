"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Table2,
  Filter,
  PanelRight,
  Layers,
  BarChart3,
  Search,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CommandItem {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const commands: CommandItem[] = [
  { id: "home", label: "Overview", description: "Go to overview page", href: "/", icon: LayoutDashboard },
  { id: "table", label: "DataTable Demo", description: "Sortable, paginated table", href: "/table", icon: Table2 },
  { id: "filters", label: "Filter Builder", description: "Faceted filters & presets", href: "/filters", icon: Filter },
  { id: "details", label: "Details Drawer", description: "Drawers & modals", href: "/details", icon: PanelRight },
  { id: "states", label: "States Gallery", description: "Loading, empty, error, success", href: "/states", icon: Layers },
  { id: "kpi", label: "KPI Cards", description: "Metrics & chart placeholders", href: "/kpi", icon: BarChart3 },
];

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const filtered = commands.filter(
    (c) =>
      c.label.toLowerCase().includes(query.toLowerCase()) ||
      c.description.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[activeIndex]) {
        router.push(filtered[activeIndex].href);
        onClose();
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div
        className="fixed inset-0 bg-[var(--ux-text)]/30 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-lg overflow-hidden rounded-xl border border-[var(--ux-border)] bg-[var(--ux-surface)] shadow-[0_20px_60px_var(--ux-shadow)] animate-in fade-in slide-in-from-top-4 duration-150">
        <div className="flex items-center gap-3 border-b border-[var(--ux-border)] px-4 py-3">
          <Search className="h-4 w-4 text-[var(--ux-text-muted)] shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search pages..."
            className="flex-1 bg-transparent text-sm text-[var(--ux-text)] placeholder:text-[var(--ux-text-muted)] focus:outline-none"
          />
          <button
            onClick={onClose}
            className="rounded p-1 hover:bg-[var(--ux-surface-2)] text-[var(--ux-text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ux-ring)]"
            aria-label="Close palette"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <ul className="max-h-80 overflow-y-auto p-2 scrollbar-thin" role="listbox">
          {filtered.length === 0 ? (
            <li className="px-3 py-8 text-center text-sm text-[var(--ux-text-muted)]">
              No results found
            </li>
          ) : (
            filtered.map((item, index) => {
              const Icon = item.icon;
              return (
                <li key={item.id} role="option" aria-selected={index === activeIndex}>
                  <button
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors",
                      index === activeIndex
                        ? "bg-[var(--ux-accent)]/10 text-[var(--ux-accent)]"
                        : "text-[var(--ux-text)] hover:bg-[var(--ux-surface-2)]"
                    )}
                    onClick={() => {
                      router.push(item.href);
                      onClose();
                    }}
                    onMouseEnter={() => setActiveIndex(index)}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{item.label}</div>
                      <div className="text-xs text-[var(--ux-text-muted)] truncate">{item.description}</div>
                    </div>
                  </button>
                </li>
              );
            })
          )}
        </ul>

        <div className="border-t border-[var(--ux-border)] px-4 py-2 flex items-center gap-4 text-xs text-[var(--ux-text-muted)]">
          <span><kbd className="rounded bg-[var(--ux-surface-2)] px-1 py-0.5">↑↓</kbd> navigate</span>
          <span><kbd className="rounded bg-[var(--ux-surface-2)] px-1 py-0.5">↵</kbd> go</span>
          <span><kbd className="rounded bg-[var(--ux-surface-2)] px-1 py-0.5">Esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
