"use client";

import { Menu, Search, Sun, Moon, HelpCircle, Command } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";

interface TopBarProps {
  onMenuClick: () => void;
  onSearchClick: () => void;
}

export function TopBar({ onMenuClick, onSearchClick }: TopBarProps) {
  const [isDark, setIsDark] = useState(false);

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
    <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-[var(--ux-border)] bg-[var(--ux-surface)]/80 backdrop-blur-sm px-4">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex-1">
        <button
          onClick={onSearchClick}
          className="flex h-9 w-full max-w-xs items-center gap-2 rounded-md border border-[var(--ux-border)] bg-[var(--ux-surface-2)] px-3 text-sm text-[var(--ux-text-muted)] hover:border-[var(--ux-accent)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ux-ring)]"
          aria-label="Open search"
        >
          <Search className="h-4 w-4" />
          <span className="flex-1 text-left">Search...</span>
          <kbd className="hidden sm:flex items-center gap-1 rounded bg-[var(--ux-border)] px-1.5 py-0.5 text-xs">
            <Command className="h-3 w-3" />
            <span>K</span>
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Help"
        >
          <HelpCircle className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
