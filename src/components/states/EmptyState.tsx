"use client";

import { Inbox, Search, Filter, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface EmptyStateProps {
  type?: "default" | "search" | "filtered" | "error";
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const configs = {
  default: {
    icon: Inbox,
    title: "Nothing here yet",
    description: "Create your first item to get started.",
  },
  search: {
    icon: Search,
    title: "No results found",
    description: "Try adjusting your search term or checking for typos.",
  },
  filtered: {
    icon: Filter,
    title: "No matching incidents",
    description: "Try removing some filters to see more results.",
  },
  error: {
    icon: AlertCircle,
    title: "Something went wrong",
    description: "An unexpected error occurred. Please try again.",
  },
};

export function EmptyState({ type = "default", title, description, action }: EmptyStateProps) {
  const config = configs[type];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--ux-surface-2)] mb-5">
        <Icon className="h-8 w-8 text-[var(--ux-text-muted)]" />
      </div>
      <h3 className="text-base font-semibold text-[var(--ux-text)] mb-1">
        {title ?? config.title}
      </h3>
      <p className="text-sm text-[var(--ux-text-muted)] max-w-xs leading-relaxed">
        {description ?? config.description}
      </p>
      {action && (
        <Button className="mt-5" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
