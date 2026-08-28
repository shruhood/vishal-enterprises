# Design System

## Principles

Industrial, trustworthy, premium — not a generic SaaS look. Orange is a
deliberate, restrained accent, not a wash across the whole UI. Most
surfaces are neutral so the orange keeps its weight for CTAs, active
states, and brand moments.

## Tokens

All tokens live in `apps/web/src/styles/tokens.css` as CSS custom
properties on `:root`, with overrides under `[data-theme="dark"]`.
Components must reference tokens (`var(--color-primary)`, etc.) —
never a hard-coded hex value. This keeps re-theming or a future
rebrand to a single-file change.

Token groups:

| Group | Examples |
|---|---|
| Brand | `--color-primary`, `--color-primary-hover`, `--color-primary-light` |
| Surface | `--color-background`, `--color-surface`, `--color-surface-elevated` |
| Text | `--color-text`, `--color-text-muted`, `--color-text-on-primary` |
| Status | `--color-success`, `--color-warning`, `--color-danger` (+ `-light` variants) |
| Spacing | `--space-1` … `--space-9` (4px → 96px scale) |
| Radius | `--radius-sm/md/lg/full` |
| Type | `--font-sans`, `--font-size-xs` … `--font-size-3xl` |
| Motion | `--transition-fast/base`, `--focus-ring` |

## Theming

Three modes: **Light**, **Dark**, **System**. Implemented in
`apps/web/src/theme/ThemeProvider.tsx`:

- Preference is stored in `localStorage` under `ve-theme`.
- `system` mode tracks `prefers-color-scheme` live via a `matchMedia`
  listener.
- A small inline script in `index.html` sets `data-theme` on
  `<html>` before React hydrates, avoiding a flash of the wrong theme.
- Dark mode is hand-tuned (not an automatic inversion) — surfaces,
  borders and the orange itself all get distinct dark-mode values so
  contrast and "premium" feel hold up.

## Components (Phase 0)

- `Button` — `primary` / `secondary` / `ghost` variants, renders as
  `<button>` or `<a>` via an `as` prop. 44px minimum touch target.
- `Container` — max-width + responsive horizontal padding wrapper.
- `Header` / `Navigation` / `MobileMenu` / `ThemeToggle` / `Footer` —
  the application shell.
- `Layout` — wraps every page with header, skip link, main landmark,
  footer.

Each component pairs a `.tsx` with a co-located `.css` file scoped by a
`ve-` class prefix — no CSS-in-JS runtime, no utility-framework
dependency, keeping the bundle minimal per the project's "no
unnecessary dependencies" constraint.

## Accessibility baked into the foundation

- Skip-to-content link, visible on focus.
- Semantic landmarks (`header`, `nav`, `main`, `footer`).
- Visible focus rings via `:focus-visible` and a shared `--focus-ring`
  token (not browser default outline removal without replacement).
- Mobile menu is a proper dialog (`role="dialog"`, `aria-modal`,
  Escape-to-close, initial focus moved into the panel).
- `prefers-reduced-motion` respected globally in `global.css`.
- All interactive targets sized for touch (44px minimum).

## Extending the system

New brand colors, spacing, or type sizes go in `tokens.css` first, then
get consumed by components — never the reverse.
