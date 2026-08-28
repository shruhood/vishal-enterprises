# Vishal Enterprises — Deployment

## Cloudflare (live)

| App         | URL                                                              | Status |
| ----------- | ---------------------------------------------------------------- | ------ |
| Web (Pages) | https://vishal-enterprises-web.pages.dev                         | Live   |
| API (Worker)| https://vishal-enterprises-api.gujaratsamachar.workers.dev       | Live   |
| API health  | https://vishal-enterprises-api.gujaratsamachar.workers.dev/health| 200 OK |

## GitHub

- Repo: https://github.com/shruhood/vishal-enterprises
- Branch: `main`
- Pushed: 2 commits (initial scaffold + Cloudflare deployment)

## Cloudflare Resources

- **D1 database** `vishal_db` (APAC) — `id: 81e300fc-6339-40e2-a008-086062404336`
- **Pages project** `vishal-enterprises-web` (production branch `main`)
- **Worker** `vishal-enterprises-api` (account: Dakshingujaratconnect@gmail.com)
- **R2 bucket** `vishal-documents` — NOT YET ENABLED (R2 is not activated on this Cloudflare account)

## Manual steps remaining

### 1. Enable R2 (Cloudflare Dashboard)

1. Go to https://dash.cloudflare.com → R2 → "Purchase R2 Plan" (free tier available)
2. After activation, run:
   ```bash
   cd apps/api
   npx wrangler r2 bucket create vishal-documents --location=apac
   ```
3. Uncomment the `[[r2_buckets]]` block in `apps/api/wrangler.toml`
4. Uncomment `DOCUMENTS: R2Bucket;` in `apps/api/src/types/env.ts`
5. Redeploy: `npx wrangler deploy`

### 2. Connect Cloudflare Pages to GitHub (auto-deploy on push)

1. Go to https://dash.cloudflare.com → Workers & Pages → `vishal-enterprises-web` → Settings → Builds
2. Click "Connect to Git" → select `shruhood/vishal-enterprises`
3. Build settings:
   - Production branch: `main`
   - Build command: `pnpm --filter @vishal/web build`
   - Build directory: `apps/web/dist`
   - Root directory: `/`
   - Environment variables: (none required for now)
4. Save → future `git push` will auto-deploy

### 3. Add custom domain (optional)

Once you have a domain, in Cloudflare Pages → Custom domains:
- `vishalentrerprises.com` (and any subdomains) → Pages

For the API Worker:
- `api.vishalentrerprises.com` → Workers Routes → `vishal-enterprises-api`

### 4. D1 migrations (when schema is finalized)

```bash
cd apps/api
npx wrangler d1 migrations apply vishal_db --remote
```

The schema lives in `apps/api/src/db/schema.sql`.

## Local development

```bash
pnpm install
pnpm dev:web    # http://localhost:5173
pnpm dev:api    # http://localhost:8787
```

## Secrets to configure later (via `wrangler secret put`)

- `TURNSTILE_SECRET_KEY` — Cloudflare Turnstile
- `SESSION_SIGNING_SECRET` — generate via `openssl rand -hex 32`
- `ADMIN_INVITE_SECRET` — generate via `openssl rand -hex 32`
