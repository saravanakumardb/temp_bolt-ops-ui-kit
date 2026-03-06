"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Table2, Filter, PanelRight, Layers, ChartBar as BarChart3, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const navItems: NavItem[] = [
  { href: "/", label: "Overview", icon: LayoutDashboard, description: "Landing page" },
  { href: "/table", label: "DataTable", icon: Table2, description: "Sortable, filterable table" },
  { href: "/filters", label: "Filters", icon: Filter, description: "Filter builder demo" },
  { href: "/details", label: "Details", icon: PanelRight, description: "Drawers & modals" },
  { href: "/states", label: "States", icon: Layers, description: "Loading, empty, error" },
  { href: "/kpi", label: "KPI Cards", icon: BarChart3, description: "Metrics & charts" },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-20 bg-[var(--ux-text)]/20 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-30 flex h-full w-64 flex-col border-r border-[var(--ux-border)] bg-[var(--ux-surface)] transition-transform duration-300",
          "lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-[var(--ux-border)] px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--ux-accent)]">
              <Zap className="h-4 w-4 text-[var(--ux-accent-foreground)]" />
            </div>
            <span className="text-sm font-semibold text-[var(--ux-text)]">Ops UI Kit</span>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 hover:bg-[var(--ux-surface-2)] text-[var(--ux-text-muted)] lg:hidden focus-visible:ring-2 focus-visible:ring-[var(--ux-ring)] focus-visible:outline-none"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 scrollbar-thin">
          <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-[var(--ux-text-muted)]">
            Components
          </p>
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-[var(--ux-ring)] focus-visible:outline-none",
                      isActive
                        ? "bg-[var(--ux-accent)]/10 text-[var(--ux-accent)] font-medium"
                        : "text-[var(--ux-text-muted)] hover:bg-[var(--ux-surface-2)] hover:text-[var(--ux-text)]"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div>{item.label}</div>
                    </div>
                    {isActive && (
                      <div className="h-1.5 w-1.5 rounded-full bg-[var(--ux-accent)]" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-[var(--ux-border)] p-4">
          <div className="rounded-md bg-[var(--ux-surface-2)] p-3">
            <p className="text-xs font-medium text-[var(--ux-text)]">Bolt Ops UI Kit</p>
            <p className="mt-0.5 text-xs text-[var(--ux-text-muted)]">Production-grade patterns</p>
          </div>
        </div>
      </aside>
    </>
  );
}
