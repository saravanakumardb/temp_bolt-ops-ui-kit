# Bolt App 1 — Ops UI Kit (Micro-App)

Before you start: read and follow `DESIGN_SYSTEM_BRIEF.md`.

## Mission

Build a **UI/UX-rich** Next.js 16 micro-app called **Ops UI Kit** that showcases production-grade operations dashboard patterns. This app will later be cross-pollinated into `dashboards/admin-web` and `dashboards/tracker-web`.

## Scope / Safety

- Only change files in this repository.
- **No backend / no network calls.** Use mock data and localStorage.
- **No auth, no Cosmos, no Key Vault.**
- **No `console.log`.**
- **No hardcoded colors.** Define a small set of CSS variables in `src/app/globals.css` (e.g. `--ux-*`) and only use those + Tailwind utilities.
- **Do not edit** any other repo folder.

## Stack requirements

- Next.js `16.1.x` (App Router)
- React `19.x`
- TypeScript strict
- TailwindCSS v4
- shadcn/ui-style components (Radix + Tailwind)
- lucide-react icons
- pnpm package manager

## App pages (required)

- `/` — overview landing + links to demos
- `/table` — DataTable demo
- `/filters` — filter builder demo
- `/details` — drawers/modals demo
- `/states` — loading/empty/error/success patterns
- `/kpi` — KPI cards + tiny chart placeholders

## App shell UX (required)

- Left sidebar navigation (responsive)
- Top bar with:
  - global search input (client-side; filters mock data)
  - theme toggle (light/dark)
  - help button showing shortcuts
- Keyboard shortcuts:
  - `Cmd+K` opens command palette
  - `Esc` closes modal/drawer

## Demo requirements (high polish)

### 1) DataTable

Mock dataset (~80–120 rows) representing “incidents” or “webhook deliveries” with:

- `id`, `status`, `severity`, `service`, `createdAt`, `requestId`, `summary`, `tags`

Table must include:

- sorting
- pagination
- column visibility toggle
- row selection + bulk actions bar
- per-row actions menu:
  - copy `requestId`
  - copy row JSON
  - open details drawer
- sticky header
- expandable row details

### 2) Filter Builder

A filter panel supporting:

- faceted filters (status, severity, service)
- date range (simple UI)
- free-text search
- active filter chips row
- clear all
- save/load presets (localStorage)

### 3) Details Drawer

Row click opens right-side drawer with tabs:

- Overview (key/value)
- Raw JSON (pretty-printed)
- Notes (editable, stored locally)

Focus rules:

- opening drawer moves focus inside
- closing returns focus to triggering row

### 4) States Gallery

Reusable patterns for:

- skeleton loading
- empty state with CTA
- inline error banner with retry
- toast notifications
- destructive confirm dialog

## Deliverables

Create a complete app with:

- `package.json` scripts: `dev`, `check`, `build`, `lint`, `test`
- `check` must run `tsc --noEmit` + `eslint`
- `build` must run `next build --webpack`

## Verification

From the repo root:

- `pnpm install`
- `pnpm run check`
- `pnpm run build`

## Output expectation

Open a PR containing only this app. No other repo changes.
