"use client";

import { useEffect, useRef, useState } from "react";
import { X, FileText, Code2, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusBadge, SeverityBadge } from "@/components/StatusBadge";
import { cn } from "@/lib/utils";
import type { Incident } from "@/data/incidents";
import { format } from "date-fns";

type Tab = "overview" | "json" | "notes";

interface DetailsDrawerProps {
  incident: Incident | null;
  triggerRef?: React.RefObject<HTMLElement | null>;
  onClose: () => void;
}

function KV({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="py-3 border-b border-[var(--ux-border)] last:border-0">
      <p className="text-xs font-medium text-[var(--ux-text-muted)] mb-1">{label}</p>
      <div className="text-sm text-[var(--ux-text)]">{children}</div>
    </div>
  );
}

function getNotesKey(id: string) {
  return `ux-kit-notes-${id}`;
}

export function DetailsDrawer({ incident, triggerRef, onClose }: DetailsDrawerProps) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [notes, setNotes] = useState("");
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (incident) {
      setActiveTab("overview");
      try {
        const saved = localStorage.getItem(getNotesKey(incident.id));
        setNotes(saved ?? "");
      } catch {
        setNotes("");
      }
      requestAnimationFrame(() => closeButtonRef.current?.focus());
    } else {
      triggerRef?.current?.focus();
    }
  }, [incident, triggerRef]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (incident) {
      document.addEventListener("keydown", handleKey);
    }
    return () => document.removeEventListener("keydown", handleKey);
  }, [incident, onClose]);

  const saveNotes = (value: string) => {
    setNotes(value);
    if (incident) {
      try {
        localStorage.setItem(getNotesKey(incident.id), value);
      } catch {
        /* ignore */
      }
    }
  };

  const tabs: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "overview", label: "Overview", icon: FileText },
    { id: "json", label: "Raw JSON", icon: Code2 },
    { id: "notes", label: "Notes", icon: StickyNote },
  ];

  return (
    <>
      {incident && (
        <div
          className="fixed inset-0 z-40 bg-[var(--ux-text)]/20 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={incident ? `Incident ${incident.id} details` : "Incident details"}
        className={cn(
          "fixed right-0 top-0 z-50 h-full w-full max-w-lg border-l border-[var(--ux-border)] bg-[var(--ux-surface)] shadow-[-4px_0_24px_var(--ux-shadow)] flex flex-col transition-transform duration-300",
          incident ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-[var(--ux-border)] px-5 py-4">
          <div>
            {incident ? (
              <>
                <p className="text-xs text-[var(--ux-text-muted)]">Incident</p>
                <h2 className="text-base font-semibold text-[var(--ux-text)]">{incident.id}</h2>
              </>
            ) : (
              <h2 className="text-base font-semibold text-[var(--ux-text)]">Incident details</h2>
            )}
          </div>
          <Button
            ref={closeButtonRef}
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close details drawer"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {incident && (
          <>
            <div className="flex border-b border-[var(--ux-border)] px-5">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 border-b-2 px-1 py-3 text-sm font-medium transition-colors mr-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ux-ring)]",
                      activeTab === tab.id
                        ? "border-[var(--ux-accent)] text-[var(--ux-accent)]"
                        : "border-transparent text-[var(--ux-text-muted)] hover:text-[var(--ux-text)]"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin p-5">
              {activeTab === "overview" && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <StatusBadge status={incident.status} />
                    <SeverityBadge severity={incident.severity} />
                  </div>
                  <KV label="Summary">{incident.summary}</KV>
                  <KV label="Service">
                    <span className="rounded bg-[var(--ux-surface-2)] px-2 py-0.5 text-xs font-mono">
                      {incident.service}
                    </span>
                  </KV>
                  <KV label="Request ID">
                    <span className="font-mono text-[var(--ux-text-muted)]">{incident.requestId}</span>
                  </KV>
                  <KV label="Created">
                    {format(new Date(incident.createdAt), "PPpp")}
                  </KV>
                  <KV label="Tags">
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {incident.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-[var(--ux-surface-2)] px-2.5 py-0.5 text-xs text-[var(--ux-text-muted)]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </KV>
                </div>
              )}

              {activeTab === "json" && (
                <div>
                  <pre className="overflow-x-auto rounded-lg bg-[var(--ux-surface-2)] p-4 text-xs font-mono text-[var(--ux-text)] leading-relaxed scrollbar-thin">
                    {JSON.stringify(incident, null, 2)}
                  </pre>
                </div>
              )}

              {activeTab === "notes" && (
                <div className="flex flex-col gap-3 h-full">
                  <p className="text-sm text-[var(--ux-text-muted)]">
                    Notes are saved locally in your browser for this incident.
                  </p>
                  <textarea
                    value={notes}
                    onChange={(e) => saveNotes(e.target.value)}
                    placeholder="Add notes about this incident..."
                    className="flex-1 min-h-[300px] w-full rounded-lg border border-[var(--ux-border)] bg-[var(--ux-surface-2)] p-3 text-sm text-[var(--ux-text)] placeholder:text-[var(--ux-text-muted)] resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ux-ring)]"
                  />
                  <p className="text-xs text-[var(--ux-text-muted)]">
                    {notes.length} characters — auto-saved
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
