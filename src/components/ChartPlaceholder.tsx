"use client";

import { BarChart3, LineChart, PieChart, AreaChart } from "lucide-react";
import { cn } from "@/lib/utils";

type ChartType = "bar" | "line" | "pie" | "area";

interface ChartPlaceholderProps {
  type?: ChartType;
  title?: string;
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
  return (
    <div className="flex items-end gap-1 h-full w-full px-2 pb-2">
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm bg-[var(--ux-accent)]/20 transition-all"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

function MiniLineChart() {
  const points = [30, 45, 35, 60, 50, 70, 55, 80, 65, 75, 60, 85];
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const width = 100;
  const height = 60;
  const xs = points.map((_, i) => (i / (points.length - 1)) * width);
  const ys = points.map((p) => height - ((p - min) / range) * height * 0.8 - height * 0.1);

  const pathD = xs.map((x, i) => `${i === 0 ? "M" : "L"} ${x} ${ys[i]}`).join(" ");
  const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

  return (
    <div className="w-full h-full px-2 pb-2 pt-2">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--ux-accent)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--ux-accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#lineGrad)" />
        <path d={pathD} fill="none" stroke="var(--ux-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function MiniDonutChart() {
  const segments = [
    { pct: 35, color: "var(--ux-danger)" },
    { pct: 20, color: "var(--ux-warning)" },
    { pct: 30, color: "var(--ux-success)" },
    { pct: 15, color: "var(--ux-accent)" },
  ];

  const cx = 50;
  const cy = 50;
  const r = 35;
  const innerR = 22;
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
    <div className="w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-full h-full max-w-[80px] max-h-[80px]">
        {paths.map((d, i) => (
          <path key={i} d={d} fill={segments[i].color} opacity="0.7" />
        ))}
      </svg>
    </div>
  );
}

export function ChartPlaceholder({ type = "bar", title, height = "h-48", className }: ChartPlaceholderProps) {
  const Icon = chartIcons[type];

  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--ux-border)] bg-[var(--ux-surface)] overflow-hidden shadow-[0_1px_4px_var(--ux-shadow)]",
        className
      )}
    >
      {title && (
        <div className="flex items-center gap-2 border-b border-[var(--ux-border)] px-4 py-3">
          <Icon className="h-4 w-4 text-[var(--ux-text-muted)]" />
          <span className="text-sm font-semibold text-[var(--ux-text)]">{title}</span>
        </div>
      )}
      <div className={cn(height, "relative")}>
        {type === "bar" && <MiniBarChart />}
        {type === "line" && <MiniLineChart />}
        {type === "area" && <MiniLineChart />}
        {type === "pie" && <MiniDonutChart />}
      </div>
    </div>
  );
}
