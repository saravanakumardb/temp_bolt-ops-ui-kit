# UX Token Contract (Shared)

This repo must use the following CSS custom properties (tokens). Define them in `src/app/globals.css` under `:root` and optionally provide a `.dark` override.

## Core surfaces

- `--ux-bg`
- `--ux-surface`
- `--ux-surface-2`
- `--ux-border`

## Text

- `--ux-text`
- `--ux-text-muted`

## Brand / states

- `--ux-accent`
- `--ux-accent-foreground`
- `--ux-danger`
- `--ux-warning`
- `--ux-success`

## Focus + shadows

- `--ux-ring`
- `--ux-shadow`

## Usage examples

- Background: `bg-[var(--ux-bg)]`
- Card: `bg-[var(--ux-surface)] border border-[var(--ux-border)]`
- Primary button: `bg-[var(--ux-accent)] text-[var(--ux-accent-foreground)]`
- Muted text: `text-[var(--ux-text-muted)]`

## Integration note

When this repo’s components are copied into another app, we will map these variables to that app’s token system.
