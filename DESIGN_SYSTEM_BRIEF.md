# Design System Brief (Must Follow)

These rules exist so this repo’s output is **production-reusable** across the ByteLyst workspace dashboards and product web apps.

## Non-negotiable rules

- No `console.log`.
- No hardcoded API URLs.
- No network calls in this repo (use mock data / local JSON / localStorage).
- **No hardcoded colors**:
  - No hex (e.g. `#fff`)
  - No `rgb/rgba()`
  - No `hsl/hsla()`
  - No Tailwind arbitrary hex classes (e.g. `bg-[#123456]`)

## Token usage

- Use the shared token contract in `UX_TOKEN_CONTRACT.md`.
- Components must reference CSS variables via Tailwind arbitrary values, e.g.:
  - `bg-[var(--ux-surface)]`
  - `text-[var(--ux-text)]`
  - `border-[var(--ux-border)]`

## Component architecture (reusability)

- Reusable components live in `src/components/`.
- Pages under `src/app/**` should mostly compose components.
- Components must NOT import from `src/app/**`.
- Keep data mocks in `src/data/**`.

## Accessibility + UX

- Keyboard accessible (Tab/Shift+Tab, Enter/Space).
- `Esc` closes dialogs/drawers.
- Focus returns to the triggering control when overlays close.
- Mobile usable.
