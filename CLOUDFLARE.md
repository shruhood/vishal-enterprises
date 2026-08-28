# Cloudflare Setup

## Services used

| Service | Purpose | Binding |
|---|---|---|
| Cloudflare Pages | Hosts the static `apps/web` build | — |
| Cloudflare Workers | Hosts the `apps/api` Hono app | — |
| Cloudflare D1 | Structured relational data | `DB` |
| Cloudflare R2 | Private file storage (resumes, documents) | `DOCUMENTS` |
| Cloudflare Turnstile | Bot protection on public forms | `TURNSTILE_SECRET_KEY` secret |
| Cloudflare Web Analytics | Privacy-respecting site analytics | Pages dashboard snippet (not yet added) |

## One-time setup

```bash
# Authenticate
pnpm dlx wrangler login

# Create the D1 database, then paste the returned database_id
# into apps/api/wrangler.toml under [[d1_databases]]
wrangler d1 create vishal_db

# Create the private R2 bucket used for worker documents
wrangler r2 bucket create vishal-documents

# Set secrets (prompts for value; never pass secrets as CLI args in scripts)
wrangler secret put TURNSTILE_SECRET_KEY
wrangler secret put SESSION_SIGNING_SECRET
wrangler secret put ADMIN_INVITE_SECRET
```

## `apps/api/wrangler.toml`

Already scaffolded with:

- `[[d1_databases]]` binding `DB` → `vishal_db` (placeholder `database_id`)
- `[[r2_buckets]]` binding `DOCUMENTS` → `vishal-documents`
- `[vars]` for non-secret config (`ENVIRONMENT`, `ALLOWED_ORIGIN`)
- `[observability] enabled = true` for Workers Logs

Replace `[D1_DATABASE_ID]` with the real ID from `wrangler d1 create`
before deploying.

## R2 access policy

The `vishal-documents` bucket is **never** given public access and has
no public bucket domain configured. All reads/writes go through
authenticated Worker routes; downloads use short-lived signed URLs
generated server-side. This is a hard requirement, not a default to
revisit later (see `SECURITY.md`).

## Cloudflare Pages project

Create a Pages project pointed at `apps/web`, with:

- Build command: `pnpm --filter @vishal/web build`
- Build output directory: `apps/web/dist`
- Root directory: repository root (so pnpm workspace resolution works)

`apps/web/public/_redirects` handles SPA fallback routing so client-side
routes (e.g. `/employers`) resolve on hard refresh.

## Environments

`ENVIRONMENT` (`development` / `staging` / `production`) and
`ALLOWED_ORIGIN` are set per-environment in `wrangler.toml` (or via
Cloudflare dashboard environment overrides) so the API only accepts
CORS requests from the matching frontend origin.

## Turnstile

Site key goes in the frontend (public, safe to expose). Secret key is a
Worker secret used server-side to verify tokens on: employer enquiry,
worker registration, contact form, job application. Not yet wired up in
Phase 0 — forms don't exist yet.
