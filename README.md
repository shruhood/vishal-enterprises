# Vishal Enterprises — Workforce Management Platform

Monorepo for the Vishal Enterprises public website, employer/worker intake
system, and future admin CRM — built for Cloudflare's edge platform.

> **Status:** Phase 0 — foundation only. Application shell, design system,
> and infrastructure config exist; most pages and the full CRM are not yet
> implemented. See `ROADMAP.md`.

## Structure

```
apps/
  web/    Frontend — Vite + React + TypeScript, deployed to Cloudflare Pages
  api/    Backend  — Cloudflare Worker (Hono) with D1 + R2, deployed via Wrangler
```

Two independently deployable apps, connected only over HTTP — the frontend
never touches D1 or R2 directly.

## Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io) 9+
- A Cloudflare account with Wrangler CLI access (`pnpm dlx wrangler login`)

## Local development

```bash
pnpm install

# Terminal 1 — API (Worker)
pnpm dev:api

# Terminal 2 — Web (Vite dev server)
pnpm dev:web
```

The web app runs at `http://localhost:5173`. The Worker API runs locally via
`wrangler dev` and proxies to a local D1 replica.

## Environment & secrets

- Non-secret config lives in `apps/api/wrangler.toml` under `[vars]`.
- Secrets (Turnstile key, session signing secret, etc.) are set with
  `wrangler secret put <NAME>` and, for local dev, in `apps/api/.dev.vars`
  (copy from `.dev.vars.example` — never commit the real file).
- Company-facing content (phone, email, address, registration number) is
  centralized in `apps/web/src/config/company.ts` as placeholders — update
  there once real details are available.

## Documentation

- `ARCHITECTURE.md` — system design, data flow, why this stack
- `DESIGN-SYSTEM.md` — tokens, theming, component conventions
- `CLOUDFLARE.md` — bindings, deployment, environment setup
- `SECURITY.md` — security model, current state vs. planned
- `ROADMAP.md` — phased build plan

## Deployment

```bash
pnpm build:web && pnpm deploy:web   # Cloudflare Pages
pnpm deploy:api                     # Cloudflare Worker
```

Both commands assume `wrangler login` has been run and `wrangler.toml` /
Pages project settings have been configured with real Cloudflare resource
IDs (see `CLOUDFLARE.md`).
