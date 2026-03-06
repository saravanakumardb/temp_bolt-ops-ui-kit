"use client";

import { Menu, Search, Sun, Moon, Command } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/": "Overview",
  "/table": "DataTable",
  "/filters": "Filter Builder",
  "/details": "Details Drawer",
  "/states": "States Gallery",
  "/kpi": "KPI Cards",
};

interface TopBarProps {
  onMenuClick: () => void;
  onSearchClick: () => void;
}

export function TopBar({ onMenuClick, onSearchClick }: TopBarProps) {
  const [isDark, setIsDark] = useState(false);
  const pathname = usePathname();
  const pageTitle = pageTitles[pathname] ?? "";

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = stored ? stored === "dark" : prefersDark;
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-[var(--ux-border)] bg-[var(--ux-surface)]/90 backdrop-blur-md px-4">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden shrink-0"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {pageTitle && (
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <span className="text-xs text-[var(--ux-text-muted)]">Kit</span>
          <span className="text-xs text-[var(--ux-border)]">/</span>
          <span className="text-sm font-medium text-[var(--ux-text)]">{pageTitle}</span>
        </div>
      )}

      <div className="flex-1">
        <button
          onClick={onSearchClick}
          className="flex h-9 w-full max-w-xs items-center gap-2 rounded-lg border border-[var(--ux-border)] bg-[var(--ux-surface-2)] px-3 text-sm text-[var(--ux-text-muted)] hover:border-[var(--ux-accent)]/50 hover:bg-[var(--ux-surface)] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ux-ring)]"
          aria-label="Open search"
        >
          <Search className="h-3.5 w-3.5 shrink-0" />
          <span className="flex-1 text-left text-xs">Search components...</span>
          <kbd className="hidden sm:flex items-center gap-0.5 rounded bg-[var(--ux-border)] px-1.5 py-0.5 text-xs font-mono">
            <Command className="h-2.5 w-2.5" />
            <span>K</span>
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark
            ? <Sun className="h-4 w-4 text-[var(--ux-warning)]" />
            : <Moon className="h-4 w-4" />
          }
        </Button>
      </div>
    </header>
  );
}
