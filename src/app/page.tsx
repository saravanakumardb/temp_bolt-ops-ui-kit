import Link from "next/link";
import { Table2, Filter, PanelRight, Layers, ChartBar as BarChart3, ArrowRight, Zap, Command } from "lucide-react";

const pages = [
  {
    href: "/table",
    icon: Table2,
    label: "DataTable",
    description: "Sortable, paginated table with column visibility, row selection, bulk actions, expandable rows, and per-row menus.",
    tags: ["sorting", "pagination", "selection", "bulk-actions"],
  },
  {
    href: "/filters",
    icon: Filter,
    label: "Filter Builder",
    description: "Faceted filters with multi-select dropdowns, date range picker, free-text search, active chips, and save/load presets.",
    tags: ["faceted", "date-range", "presets", "chips"],
  },
  {
    href: "/details",
    icon: PanelRight,
    label: "Details Drawer",
    description: "Right-side drawer with tabbed content: Overview, Raw JSON, and editable Notes. Focus-managed with Esc to close.",
    tags: ["drawer", "tabs", "focus-trap", "notes"],
  },
  {
    href: "/states",
    icon: Layers,
    label: "States Gallery",
    description: "Skeleton loading, empty states, inline error banners, toast notifications, and destructive confirm dialogs.",
    tags: ["skeleton", "empty", "error", "toast", "confirm"],
  },
  {
    href: "/kpi",
    icon: BarChart3,
    label: "KPI Cards",
    description: "Metric cards with trend indicators and interactive chart placeholders (bar, line, donut).",
    tags: ["metrics", "trends", "charts"],
  },
];

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--ux-accent)]">
            <Zap className="h-5 w-5 text-[var(--ux-accent-foreground)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--ux-text)]">Bolt Ops UI Kit</h1>
            <p className="text-sm text-[var(--ux-text-muted)]">Production-grade operations dashboard patterns</p>
          </div>
        </div>

        <p className="text-[var(--ux-text-muted)] leading-relaxed max-w-2xl">
          A curated collection of reusable UI components and interaction patterns for ops dashboards.
          Built with Next.js, Tailwind CSS, and semantic CSS tokens — ready to drop into{" "}
          <code className="rounded bg-[var(--ux-surface-2)] px-1.5 py-0.5 text-xs font-mono text-[var(--ux-text)]">
            dashboards/admin-web
          </code>{" "}
          and{" "}
          <code className="rounded bg-[var(--ux-surface-2)] px-1.5 py-0.5 text-xs font-mono text-[var(--ux-text)]">
            dashboards/tracker-web
          </code>
          .
        </p>

        <div className="mt-4 flex items-center gap-2 rounded-lg border border-[var(--ux-border)] bg-[var(--ux-surface)] px-4 py-3 w-fit">
          <Command className="h-4 w-4 text-[var(--ux-text-muted)]" />
          <span className="text-sm text-[var(--ux-text-muted)]">
            Press{" "}
            <kbd className="rounded bg-[var(--ux-surface-2)] px-1.5 py-0.5 text-xs font-mono">⌘K</kbd>{" "}
            to open the command palette
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pages.map((page) => {
          const Icon = page.icon;
          return (
            <Link
              key={page.href}
              href={page.href}
              className="group relative flex flex-col rounded-xl border border-[var(--ux-border)] bg-[var(--ux-surface)] p-5 transition-all hover:border-[var(--ux-accent)]/50 hover:shadow-[0_4px_16px_var(--ux-shadow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ux-ring)]"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--ux-accent)]/10">
                  <Icon className="h-5 w-5 text-[var(--ux-accent)]" />
                </div>
                <ArrowRight className="h-4 w-4 text-[var(--ux-text-muted)] transition-transform group-hover:translate-x-1" />
              </div>

              <h2 className="text-base font-semibold text-[var(--ux-text)] mb-1">{page.label}</h2>
              <p className="text-sm text-[var(--ux-text-muted)] leading-relaxed flex-1">{page.description}</p>

              <div className="flex flex-wrap gap-1.5 mt-4">
                {page.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[var(--ux-surface-2)] px-2 py-0.5 text-xs text-[var(--ux-text-muted)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 rounded-xl border border-[var(--ux-border)] bg-[var(--ux-surface-2)] p-6">
        <h2 className="text-sm font-semibold text-[var(--ux-text)] mb-3">CSS Token Contract</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-xs font-mono">
          {[
            "--ux-bg", "--ux-surface", "--ux-surface-2",
            "--ux-border", "--ux-text", "--ux-text-muted",
            "--ux-accent", "--ux-accent-foreground", "--ux-danger",
            "--ux-warning", "--ux-success", "--ux-ring", "--ux-shadow",
          ].map((token) => (
            <div key={token} className="flex items-center gap-2 text-[var(--ux-text-muted)]">
              <span className="text-[var(--ux-accent)]">var(</span>
              <span className="text-[var(--ux-text)]">{token}</span>
              <span className="text-[var(--ux-accent)]">)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
