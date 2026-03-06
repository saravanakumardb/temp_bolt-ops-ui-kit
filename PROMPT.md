# Bolt — Ops UI Kit

**GitHub repo:** `saravanakumardb/temp_bolt-ops-ui-kit`

## Push Instructions

- Push directly to `main` — do NOT open a PR
- Only modify files in this repo

## Rules

- No `console.log`
- No network calls — mock data / localStorage only
- No hardcoded colors — no hex, no rgb/rgba/hsl, no `bg-[#123456]` Tailwind classes
- Do NOT commit `.env*`, `.next/`, `node_modules/`, `.vercel/`
- pnpm only
- `pnpm run check` must pass (`tsc --noEmit` + `eslint`)
- `pnpm run build` must pass (`next build --webpack`)

## CSS Token Contract

Define in `src/app/globals.css` under `:root` (add `.dark` override):

- `--ux-bg` — page background
- `--ux-surface` — card/panel surface
- `--ux-surface-2` — elevated surface
- `--ux-border` — borders
- `--ux-text` — primary text
- `--ux-text-muted` — secondary text
- `--ux-accent` — primary accent
- `--ux-accent-foreground` — text on accent
- `--ux-danger` — destructive/error
- `--ux-warning` — warning
- `--ux-success` — success
- `--ux-ring` — focus ring
- `--ux-shadow` — shadows

Use only via Tailwind: `bg-[var(--ux-surface)]`, `text-[var(--ux-text)]`, `border-[var(--ux-border)]`

## Component Architecture

- Reusable components → `src/components/`
- Pages in `src/app/**` compose components only
- Components must NOT import from `src/app/**`

## Stack

- Next.js 16 App Router, React 19, TypeScript strict
- TailwindCSS v4, pnpm

## Mission

Build a **UI/UX-rich** Next.js 16 micro-app showcasing production-grade operations dashboard patterns for reuse in `dashboards/admin-web` and `dashboards/tracker-web`.

Additional stack: shadcn/ui-style components (Radix + Tailwind), lucide-react, data mocks in `src/data/`

## Pages

- `/` overview landing + links
- `/table` DataTable demo
- `/filters` filter builder demo
- `/details` drawers/modals demo
- `/states` loading/empty/error/success patterns
- `/kpi` KPI cards + chart placeholders

## App Shell

- Left sidebar (responsive), top bar: global search, theme toggle, help button
- `Cmd+K` opens command palette, `Esc` closes modal/drawer

## DataTable

Mock ~80–120 rows (incidents/webhook deliveries): `id`, `status`, `severity`, `service`, `createdAt`, `requestId`, `summary`, `tags`

- Sorting, pagination, column visibility toggle
- Row selection + bulk actions bar
- Per-row menu: copy requestId, copy JSON, open drawer
- Sticky header, expandable row details

## Filter Builder

- Faceted filters (status, severity, service), date range, free-text search
- Active filter chips + clear all
- Save/load presets (localStorage)

## Details Drawer

Right-side drawer on row click with tabs: Overview (key/value), Raw JSON, Notes (editable, localStorage)
Focus: moves inside on open, returns to triggering row on close

## States Gallery

Skeleton loading, empty state + CTA, inline error banner + retry, toast notifications, destructive confirm dialog

## Verification

```
pnpm install && pnpm run check && pnpm run build
```
