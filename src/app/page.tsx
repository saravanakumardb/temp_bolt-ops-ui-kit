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

const tokens = [
  { name: "--ux-bg", desc: "Page background" },
  { name: "--ux-surface", desc: "Card / panel" },
  { name: "--ux-surface-2", desc: "Elevated surface" },
  { name: "--ux-border", desc: "Dividers & borders" },
  { name: "--ux-text", desc: "Primary text" },
  { name: "--ux-text-muted", desc: "Secondary text" },
  { name: "--ux-accent", desc: "Interactive blue" },
  { name: "--ux-accent-foreground", desc: "On accent" },
  { name: "--ux-danger", desc: "Error / destructive" },
  { name: "--ux-warning", desc: "Caution / in-progress" },
  { name: "--ux-success", desc: "Positive / resolved" },
  { name: "--ux-ring", desc: "Focus ring" },
  { name: "--ux-shadow", desc: "Elevation shadow" },
];

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 animate-fade-in">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--ux-accent)] shadow-[0_4px_12px_var(--ux-accent)/0.3]">
            <Zap className="h-5 w-5 text-[var(--ux-accent-foreground)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--ux-text)] tracking-tight">Bolt-Ops-UI-Kit</h1>
            <p className="text-sm text-[var(--ux-text-muted)]">Production-grade operations dashboard patterns</p>
          </div>
        </div>

        <p className="text-[var(--ux-text-muted)] leading-relaxed max-w-2xl mb-5">
          A curated collection of reusable UI components and interaction patterns for ops dashboards.
          Built with Next.js, Tailwind CSS, and semantic CSS tokens — ready to drop into{" "}
          <code className="rounded bg-[var(--ux-surface-2)] px-1.5 py-0.5 text-xs font-mono text-[var(--ux-text)] border border-[var(--ux-border)]">
            dashboards/admin-web
          </code>{" "}
          and{" "}
          <code className="rounded bg-[var(--ux-surface-2)] px-1.5 py-0.5 text-xs font-mono text-[var(--ux-text)] border border-[var(--ux-border)]">
            dashboards/tracker-web
          </code>
          .
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-[var(--ux-border)] bg-[var(--ux-surface)] px-4 py-2.5 shadow-[0_1px_4px_var(--ux-shadow)]">
            <Command className="h-4 w-4 text-[var(--ux-text-muted)]" />
            <span className="text-sm text-[var(--ux-text-muted)]">
              Press{" "}
              <kbd className="rounded bg-[var(--ux-surface-2)] border border-[var(--ux-border)] px-1.5 py-0.5 text-xs font-mono">⌘K</kbd>{" "}
              to open the command palette
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-[var(--ux-border)] bg-[var(--ux-surface)] px-4 py-2.5 shadow-[0_1px_4px_var(--ux-shadow)]">
            <span className="h-2 w-2 rounded-full bg-[var(--ux-success)]" />
            <span className="text-sm text-[var(--ux-text-muted)]">Light &amp; dark mode supported</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        {pages.map((page, idx) => {
          const Icon = page.icon;
          return (
            <Link
              key={page.href}
              href={page.href}
              style={{ animationDelay: `${idx * 40}ms` }}
              className="animate-fade-in group relative flex flex-col rounded-xl border border-[var(--ux-border)] bg-[var(--ux-surface)] p-5 transition-all duration-200 hover:border-[var(--ux-accent)]/40 hover:shadow-[0_6px_20px_var(--ux-shadow-lg)] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ux-ring)]"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--ux-accent)]/10 transition-colors group-hover:bg-[var(--ux-accent)]/15">
                  <Icon className="h-5 w-5 text-[var(--ux-accent)]" />
                </div>
                <ArrowRight className="h-4 w-4 text-[var(--ux-text-muted)] transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[var(--ux-accent)]" />
              </div>

              <h2 className="text-base font-semibold text-[var(--ux-text)] mb-1">{page.label}</h2>
              <p className="text-sm text-[var(--ux-text-muted)] leading-relaxed flex-1">{page.description}</p>

              <div className="flex flex-wrap gap-1.5 mt-4">
                {page.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[var(--ux-surface-2)] border border-[var(--ux-border)] px-2 py-0.5 text-xs text-[var(--ux-text-muted)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="rounded-xl border border-[var(--ux-border)] bg-[var(--ux-surface)] overflow-hidden shadow-[0_1px_4px_var(--ux-shadow)]">
        <div className="flex items-center justify-between border-b border-[var(--ux-border)] px-5 py-3.5">
          <h2 className="text-sm font-semibold text-[var(--ux-text)]">CSS Token Contract</h2>
          <span className="text-xs text-[var(--ux-text-muted)] font-mono">globals.css</span>
        </div>
        <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-3 divide-[var(--ux-border)]">
          {tokens.map((token, i) => (
            <div
              key={token.name}
              className="flex items-center gap-3 px-5 py-3 border-b border-[var(--ux-border)] last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0 lg:[&:nth-last-child(-n+3)]:border-b-0 hover:bg-[var(--ux-surface-2)] transition-colors"
            >
              <div
                className="h-3 w-3 rounded-full shrink-0 ring-1 ring-[var(--ux-border)]"
                style={{
                  background: [
                    "var(--ux-bg)", "var(--ux-surface)", "var(--ux-surface-2)",
                    "var(--ux-border)", "var(--ux-text)", "var(--ux-text-muted)",
                    "var(--ux-accent)", "var(--ux-accent-foreground)", "var(--ux-danger)",
                    "var(--ux-warning)", "var(--ux-success)", "var(--ux-ring)", "var(--ux-shadow)",
                  ][i]
                }}
              />
              <div className="min-w-0">
                <p className="text-xs font-mono text-[var(--ux-accent)] truncate">{token.name}</p>
                <p className="text-xs text-[var(--ux-text-muted)]">{token.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
