export type IncidentStatus = "open" | "investigating" | "resolved" | "closed";
export type IncidentSeverity = "critical" | "high" | "medium" | "low";

export interface Incident {
  id: string;
  status: IncidentStatus;
  severity: IncidentSeverity;
  service: string;
  createdAt: string;
  requestId: string;
  summary: string;
  tags: string[];
}

const services = [
  "auth-service",
  "payment-gateway",
  "webhook-dispatcher",
  "user-api",
  "notification-service",
  "billing-service",
  "analytics-pipeline",
  "cdn-edge",
  "search-indexer",
  "data-sync",
];

const summaries: Record<IncidentSeverity, string[]> = {
  critical: [
    "Database connection pool exhausted under peak load",
    "Payment processing endpoint returning 500 errors",
    "Authentication service unresponsive — all logins failing",
    "Webhook dispatcher queue backed up with 50k+ undelivered events",
    "Memory leak causing OOM kills on primary API nodes",
  ],
  high: [
    "Elevated error rate on /api/v2/users endpoint",
    "SSL certificate renewal failed for api.example.com",
    "Retry storm detected — downstream service degraded",
    "Search indexer falling behind by 45 minutes",
    "CDN cache purge stuck — stale assets being served",
  ],
  medium: [
    "Intermittent latency spikes on analytics pipeline ingestion",
    "Notification delivery rate dropped to 87%",
    "Billing reconciliation job took 3x longer than SLA",
    "Data sync lag exceeded 10-minute threshold",
    "Non-critical background jobs queued for more than 1 hour",
  ],
  low: [
    "Deprecated endpoint still receiving traffic from old clients",
    "Log aggregation latency above baseline for 15 minutes",
    "Minor discrepancy in dashboard metrics cache",
    "Non-urgent dependency update available",
    "Scheduled maintenance window approaching",
  ],
};

const tagPool = [
  "infra",
  "database",
  "api",
  "security",
  "performance",
  "billing",
  "auth",
  "network",
  "storage",
  "cache",
  "queue",
  "webhook",
  "alert",
  "auto-remediated",
  "escalated",
  "regression",
  "hotfix",
  "on-call",
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomTags(): string[] {
  const count = Math.floor(Math.random() * 3) + 1;
  const shuffled = [...tagPool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function generateRequestId(): string {
  const chars = "abcdef0123456789";
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function subtractMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() - minutes * 60 * 1000);
}

function generateIncident(index: number): Incident {
  const severities: IncidentSeverity[] = ["critical", "high", "medium", "low"];
  const weights = [0.1, 0.2, 0.4, 0.3];
  const rand = Math.random();
  let cumulative = 0;
  let severity: IncidentSeverity = "low";
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (rand < cumulative) {
      severity = severities[i];
      break;
    }
  }

  const statusByAge = index < 10 ? "open" : index < 30 ? "investigating" : index < 60 ? "resolved" : "closed";
  const statuses: IncidentStatus[] = ["open", "investigating", "resolved", "closed"];
  const status = index % 7 === 0 ? randomFrom(statuses) : statusByAge;

  const now = new Date("2026-03-06T12:00:00Z");
  const minutesAgo = index * 47 + Math.floor(Math.random() * 30);
  const createdAt = subtractMinutes(now, minutesAgo).toISOString();

  return {
    id: `INC-${String(1000 + index).padStart(4, "0")}`,
    status,
    severity,
    service: randomFrom(services),
    createdAt,
    requestId: generateRequestId(),
    summary: randomFrom(summaries[severity]),
    tags: randomTags(),
  };
}

export const incidents: Incident[] = Array.from({ length: 100 }, (_, i) => generateIncident(i));
