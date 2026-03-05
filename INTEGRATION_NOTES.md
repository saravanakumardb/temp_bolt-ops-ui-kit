# Integration Notes (Read Me)

This repo is a UI/UX pattern source.

## Intended reuse

We will copy selected components from `src/components/**` into:

- shared dashboards (admin/tracker)
- product web apps

## How to keep code copy-friendly

- Keep reusable logic in `src/lib/**` (pure TS, UI-agnostic where possible).
- Keep data mocks in `src/data/**`.
- Avoid tight coupling to route segments.
- Prefer generic names: `DataTable`, `FiltersPanel`, `DetailsDrawer`, `EmptyState`.

## What will block adoption

- Any hardcoded colors
- Network calls / real backend wiring
- Components that only work inside a specific page due to imports from `src/app/**`
- Heavy dependency additions
