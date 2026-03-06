"use client";

import { ChartBar as BarChart3, ChartLine as LineChart, ChartPie as PieChart, ChartArea as AreaChart } from "lucide-react";
import { cn } from "@/lib/utils";

type ChartType = "bar" | "line" | "pie" | "area";

interface ChartPlaceholderProps {
  type?: ChartType;
  title?: string;
  subtitle?: string;
  height?: string;
  className?: string;
}

const chartIcons: Record<ChartType, React.ComponentType<{ className?: string }>> = {
  bar: BarChart3,
  line: LineChart,
  pie: PieChart,
  area: AreaChart,
};

function MiniBarChart() {
  const bars = [40, 65, 45, 80, 55, 70, 90, 60, 75, 50, 85, 70];
  const max = Math.max(...bars);
  return (
    <div className="flex items-end gap-1 h-full w-full px-3 pb-4 pt-3">
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm transition-all"
          style={{
            height: `${(h / max) * 100}%`,
            background: `oklch(from var(--ux-accent) l c h / ${0.15 + (h / max) * 0.5})`,
          }}
        />
      ))}
    </div>
  );
}

function MiniLineChart({ filled = false }: { filled?: boolean }) {
  const points = [30, 45, 35, 60, 50, 70, 55, 80, 65, 75, 60, 85];
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const w = 100;
  const h = 60;
  const xs = points.map((_, i) => (i / (points.length - 1)) * w);
  const ys = points.map((p) => h - ((p - min) / range) * h * 0.8 - h * 0.1);

  const pathD = xs.map((x, i) => `${i === 0 ? "M" : "L"} ${x} ${ys[i]}`).join(" ");
  const areaD = `${pathD} L ${w} ${h} L 0 ${h} Z`;
  const gradId = filled ? "areaGrad" : "lineGrad";

  return (
    <div className="w-full h-full px-2 pb-2 pt-2">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--ux-accent)" stopOpacity={filled ? "0.25" : "0.15"} />
            <stop offset="100%" stopColor="var(--ux-accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {filled && <path d={areaD} fill={`url(#${gradId})`} />}
        {!filled && <path d={areaD} fill={`url(#${gradId})`} />}
        <path
          d={pathD}
          fill="none"
          stroke="var(--ux-accent)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx={xs[xs.length - 1]} cy={ys[ys.length - 1]} r="2" fill="var(--ux-accent)" />
      </svg>
    </div>
  );
}

function MiniDonutChart() {
  const segments = [
    { pct: 35, color: "var(--ux-danger)", label: "Open" },
    { pct: 20, color: "var(--ux-warning)", label: "Investigating" },
    { pct: 30, color: "var(--ux-success)", label: "Resolved" },
    { pct: 15, color: "var(--ux-accent)", label: "Closed" },
  ];

  const cx = 50;
  const cy = 50;
  const r = 36;
  const innerR = 24;
  let cumulative = 0;

  const paths = segments.map((seg) => {
    const startAngle = (cumulative / 100) * 2 * Math.PI - Math.PI / 2;
    cumulative += seg.pct;
    const endAngle = (cumulative / 100) * 2 * Math.PI - Math.PI / 2;

    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const ix1 = cx + innerR * Math.cos(startAngle);
    const iy1 = cy + innerR * Math.sin(startAngle);
    const ix2 = cx + innerR * Math.cos(endAngle);
    const iy2 = cy + innerR * Math.sin(endAngle);

    const largeArc = seg.pct > 50 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix1} ${iy1} Z`;
  });

  return (
    <div className="w-full h-full flex items-center justify-center gap-4 px-4">
      <svg viewBox="0 0 100 100" className="w-full h-full max-w-[72px] max-h-[72px] shrink-0">
        {paths.map((d, i) => (
          <path key={i} d={d} fill={segments[i].color} opacity="0.8" />
        ))}
      </svg>
      <div className="flex flex-col gap-1.5 min-w-0">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full shrink-0" style={{ background: seg.color }} />
            <span className="text-xs text-[var(--ux-text-muted)] truncate">{seg.label}</span>
            <span className="text-xs font-medium text-[var(--ux-text)] ml-auto pl-2">{seg.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartPlaceholder({ type = "bar", title, subtitle, height = "h-48", className }: ChartPlaceholderProps) {
  const Icon = chartIcons[type];

  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--ux-border)] bg-[var(--ux-surface)] overflow-hidden shadow-[0_1px_4px_var(--ux-shadow)] transition-shadow hover:shadow-[0_4px_16px_var(--ux-shadow)]",
        className
      )}
    >
      {title && (
        <div className="flex items-start justify-between border-b border-[var(--ux-border)] px-4 py-3">
          <div>
            <div className="flex items-center gap-2">
              <Icon className="h-3.5 w-3.5 text-[var(--ux-text-muted)]" />
              <span className="text-sm font-semibold text-[var(--ux-text)]">{title}</span>
            </div>
            {subtitle && <p className="mt-0.5 text-xs text-[var(--ux-text-muted)]">{subtitle}</p>}
          </div>
        </div>
      )}
      <div className={cn(height, "relative")}>
        {type === "bar" && <MiniBarChart />}
        {type === "line" && <MiniLineChart />}
        {type === "area" && <MiniLineChart filled />}
        {type === "pie" && <MiniDonutChart />}
      </div>
    </div>
  );
}
