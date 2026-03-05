# Acceptance Checklist (PR Gate)

Your PR is acceptable only if all are true:

- Before push: `git status` is clean except for the intended app source changes.
- Before push: review `git diff` and confirm no unrelated formatting/refactors.
- No `console.log`.
- No hardcoded colors (hex/rgb/hsl) anywhere.
- No network calls.
- Forbidden files are NOT committed: `.env*`, `.next/`, `node_modules/`, `.vercel/`.
- All reusable components live in `src/components/**`.
- Components do not import from `src/app/**`.
- `pnpm run check` passes.
- `pnpm run build` passes using `next build --webpack`.
