# Architecture

## Why this stack

**Frontend — Vite + React + TypeScript on Cloudflare Pages.**
React was chosen over alternatives (Astro, Qwik, SvelteKit) because the
platform's roadmap includes two future authenticated portals (employer,
worker) plus an admin CRM — all highly interactive, form- and
state-heavy surfaces where React's component/hook model and ecosystem
(forms, tables, data-fetching libraries) pay off more than a
content-first framework would. Vite gives fast local dev and a plain
static build, which is exactly what Cloudflare Pages wants: no
server-rendering runtime to manage, no cold-start concerns, just static
assets on Cloudflare's edge CDN. `react-router-dom` handles client-side
routing; a `_redirects` rule serves `index.html` for all paths so
deep links resolve correctly.

**Backend — Cloudflare Worker with Hono.**
The API is a separate deployable from the frontend, per the requested
architecture (`Frontend → Pages/Workers → Worker API → D1 → R2`). Hono
is a minimal, TypeScript-first router built specifically for Workers'
runtime (V8 isolates, not Node) — small bundle, no unnecessary
dependencies, first-class typed bindings for `D1Database` and
`R2Bucket`. It keeps request handling, middleware (CORS, security
headers, rate limiting, auth) and route groups organized without the
overhead of a framework designed for a different runtime.

**Data — D1 (structured data) + R2 (files).**
D1 (SQLite at the edge) holds all relational data: employers, workers,
requirements, jobs, applications, deployments, site content, settings,
audit logs. R2 holds only binary/file content — resumes, certificates,
company documents — referenced from D1 by object key, never served
publicly (see `SECURITY.md`).

## Request flow

```
Browser (Pages-hosted SPA)
   │  fetch("https://api.vishalenterprises.<domain>/...")
   ▼
Cloudflare Worker (Hono app, apps/api)
   │  security headers → CORS → rate limit → route handler
   ▼
D1 (structured data)  +  R2 (private files, via signed URL issuance)
```

The frontend and API are deployed and scaled independently. The Worker
is the only thing with D1/R2 bindings — the frontend has zero direct
data access, which keeps the trust boundary simple.

## Monorepo layout

```
apps/
  web/   Vite React SPA — pages, layout, design tokens, theme
  api/   Hono Worker — routes, middleware, D1 schema (documented)
```

pnpm workspaces tie them together at the root without forcing shared
build tooling between two runtimes (browser vs. Workers) that don't
actually share a build pipeline.

## Planned data flows (future phases)

- **Worker flow:** Registration → Verification → Available → Shortlisted
  → Assigned → Active → Inactive/Completed
- **Employer flow:** Enquiry → Requirement Verification → Open
  Requirement → Candidate Search → Worker Assignment → Deployment →
  Continuous Inspection → Replacement/Additional Workforce

These are documented here and in `ROADMAP.md`; the state machines are not
yet implemented in code.
