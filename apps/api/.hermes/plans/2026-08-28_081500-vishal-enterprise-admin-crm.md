# Vishal Enterprises — Admin CRM, Job Listings & File Uploads

> **For Hermes:** Use subagent-driven-development skill to implement this plan
> task-by-task. Each task has a TDD cycle and explicit verification.

**Goal:** Add a staff-facing admin CRM (auth + dashboard), a public job
listings page, and a file-upload flow for worker documents using R2.

**Architecture:** All three features extend the existing Worker + D1 stack.
Admin auth uses signed cookies (HMAC over `SESSION_SIGNING_SECRET`). Jobs are
served from the already-present `jobs` table. File uploads use presigned R2
puts, served back through the Worker (never public bucket access).

**Tech Stack:** Hono (Worker), D1, R2, React + Vite (Pages)

---

## Prerequisites

- [ ] Enable R2 in Cloudflare Dashboard → `R2` → Create bucket `vishal-documents`
- [ ] `wrangler secret put TURNSTILE_SECRET_KEY`
- [ ] `wrangler secret put SESSION_SIGNING_SECRET`
- [ ] `wrangler secret put ADMIN_INVITE_SECRET`
- [ ] Uncomment `[[r2_buckets]]` in `apps/api/wrangler.toml`
- [ ] Uncomment `DOCUMENTS: R2Bucket;` in `apps/api/src/types/env.ts`
- [ ] Set `ALLOWED_ORIGIN` to include your custom domain if using one

---

## Phase 1 — Authentication

### Task 1: Create auth utilities (`apps/api/src/lib/auth.ts`)
**Objective:** Provide session-cookie sign/verify + password hashing.

**Step 1: Write failing test**
```ts
// apps/api/src/lib/__tests__/auth.test.ts (new)
import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword, signSession, verifySession } from "../auth";
it("hashes and verifies a password", () => {
  const h = hashPassword("secret123");
  expect(verifyPassword("secret123", h)).toBe(true);
  expect(verifyPassword("wrong", h)).toBe(false);
});
it("signs and verifies a session", () => {
  const token = signSession("user-1", "admin", "secret");
  const payload = verifySession(token, "secret");
  expect(payload.userId).toBe("user-1");
  expect(payload.role).toBe("admin");
});
```
Run: `cd apps/api && pnpm --filter @vishal/api test` — expected: FAIL (module missing)

**Step 2: Implement**
```ts
import {sha256} from "crypto"; // Workers support Web Crypto
export function hashPassword(pw: string): string {
  return sha256(pw).toString(16);
}
export function verifyPassword(pw: string, hash: string): boolean {
  return hashPassword(pw) === hash;
}
export function signSession(userId: string, role: string, secret: string): string {
  const payload = btoa(JSON.stringify({userId, role}));
  const sig = btoa(sha256(payload + secret).toString(16));
  return `${payload}.${sig}`;
}
export function verifySession(token: string, secret: string) {
  const [payload, sig] = token.split(".");
  if (btoa(sha256(payload + secret).toString(16)) !== sig) throw new Error("invalid");
  return JSON.parse(atob(payload));
}
```

**Step 3: Install + run test**
```bash
pnpm --filter @vishal/api add -D vitest
```
Run: `pnpm --filter @vishal/api test` — expected: PASS

---

## Phase 2 — Admin CRM routes

### Task 2: Create `/src/routes/auth.ts`
**Objective:** `POST /auth/login` (staff), `POST /auth/logout`, `GET /auth/me`
**Files:** `Create apps/api/src/routes/auth.ts`

### Task 3: Create `/src/routes/admin/workers.ts`
**Objective:** List, search, detail view of registered workers
`GET /admin/workers?search=...&limit=...` → returns workers + their skills

### Task 4: Create `/src/routes/admin/enquiries.ts`
**Objective:** List, filter by status, view single enquiry
`GET /admin/enquiries?status=new&limit=...`

### Task 5: Create `/src/routes/admin/jobs.ts`
**Objective:** CRUD for jobs (create, list, update, delete)
`POST /admin/jobs`, `GET /admin/jobs`, `PATCH /admin/jobs/:id`, `DELETE /admin/jobs/:id`

### Task 6: Create `/src/routes/admin/workers.ts` PATCH endpoint
**Objective:** Update worker status (`verified` → `available` → `shortlisted` → `assigned`)

### Task 7: Wire admin routes into `index.ts`
**Objective:** Mount `/admin/auth`, `/admin/workers`, `/admin/enquiries`, `/admin/jobs`
Add cookie-parsing middleware + session guard.

---

## Phase 3 — Jobs (public)

### Task 8: Create `/src/routes/jobs.ts`
**Objective:** Public job listings + detail
`GET /jobs`, `GET /jobs/:id`
Only return `is_published=1` jobs.

### Task 9: Create web `Jobs.tsx` page (replace placeholder)
**Objective:** Fetch `GET /jobs`, render list with filters by industry/location/skill-level

### Task 10: Create web `JobDetail.tsx` page
**Objective:** `/jobs/:id` → fetch single job, show title, description, industry, location, skill level

### Task 11: Update `App.tsx` routes to mount real Jobs + JobDetail

---

## Phase 4 — File uploads (worker documents)

### Task 12: Create `POST /workers/register` file upload support
**Objective:** Accept a resume file alongside worker registration
- Web uploads to R2 directly via presigned URL
- Worker registration API receives `document_key` (the R2 object key)
- `worker_documents` record links the file

### Task 13: Web `FileUpload` component
**Objective:** Pick file → request presigned PUT URL from API → upload to R2 → return key
**Files:** `src/components/forms/FileUpload.tsx`

### Task 14: Update `Workers.tsx` registration form
**Objective:** Add resume upload field (PDF, <5MB)

### Task 15: Admin download route
**Objective:** `GET /admin/workers/:id/documents/:docId/download` → signed R2 URL

---

## Phase 5 — Admin web pages

### Task 16: Admin login page
**Files:** `src/pages/admin/Login.tsx`

### Task 17: Admin dashboard layout (protected)
**Objective:** Sidebar nav: Workers | Enquiries | Jobs | Logout. Auth guard on all admin pages.

### Task 18: Workers admin page
**Objective:** Table with search + status dropdown → PATCH

### Task 19: Enquiries admin page
**Objective:** Table with status column, status-update dropdown

### Task 20: Jobs admin page
**Objective:** List + "New Job" form

---

## Files likely to change

| File | Change |
|------|--------|
| `apps/api/wrangler.toml` | Uncomment R2, add `SESSION_SIGNING_SECRET` comment |
| `apps/api/src/types/env.ts` | Uncomment `DOCUMENTS: R2Bucket` |
| `apps/api/src/index.ts` | Mount admin routes, add auth middleware |
| `apps/api/src/lib/auth.ts` | **Create** |
| `apps/api/src/lib/validate.ts` | Possibly extend for admin inputs |
| `apps/api/src/routes/auth.ts` | **Create** |
| `apps/api/src/routes/admin/workers.ts` | **Create** |
| `apps/api/src/routes/admin/enquiries.ts` | **Create** |
| `apps/api/src/routes/admin/jobs.ts` | **Create** |
| `apps/api/src/routes/jobs.ts` | **Create** |
| `apps/web/src/App.tsx` | Add /admin/* + /jobs/:id routes |
| `apps/web/src/pages/Jobs.tsx` | Convert from placeholder to real listing |
| `apps/web/src/pages/JobDetail.tsx` | **Create** |
| `apps/web/src/pages/admin/*` | **Create** multiple |
| `apps/web/src/components/forms/FileUpload.tsx` | **Create** |
| `apps/web/src/lib/seo.ts` | Extend for OG tags on job detail |

---

## Verification

After all phases:
1. `pnpm run typecheck` — zero errors
2. `pnpm run lint` — zero errors
3. `pnpm build:web` — succeeds
4. `npx wrangler deploy` (api) — succeeds
5. Live tests:
   - `POST /auth/login` with wrong password → 401
   - `POST /auth/login` with correct password → 200 + cookie
   - `GET /admin/workers` without auth → 401
   - `GET /admin/workers` with auth → 200 + worker list
   - `GET /jobs` → 200 + published jobs
   - Worker registration with resume upload → worker_documents row created
   - Admin download route → 200 with presigned R2 URL
6. Web pages load and forms submit correctly on live Pages URL
