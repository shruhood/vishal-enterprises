# Security

## Status

Phase 0 establishes the security *architecture* and a few concrete
baseline controls (security headers, CORS, typed env bindings). Most
controls below are documented intent for upcoming phases, not yet
implemented — this file tracks both so nothing gets forgotten.

## Implemented in Phase 0

- **Security headers** (`apps/api/src/middleware/security.ts`):
  `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
  `Permissions-Policy`, a conservative `Content-Security-Policy`.
- **CORS locked to one origin**: the Worker only allows the configured
  `ALLOWED_ORIGIN`, not arbitrary origins.
- **No secrets in frontend code**: `apps/web` has no access to
  `TURNSTILE_SECRET_KEY`, `SESSION_SIGNING_SECRET`, D1, or R2 — those
  exist only as Worker bindings/secrets.
- **R2 bucket is private by default** — no public bucket domain, no
  public access configured (see `CLOUDFLARE.md`).

## Planned (not yet implemented)

- **Authentication** — admin/staff login (`users` table), password
  hashing, secure session cookies (`HttpOnly`, `Secure`,
  `SameSite=Strict`).
- **Authorization** — role-based access control (`admin` vs `staff`)
  enforced per-route in the Worker.
- **Input validation** — server-side schema validation on every
  mutating route (Worker never trusts client-supplied shape/types).
- **Rate limiting** — currently a documented no-op
  (`rateLimitPlaceholder`); to be backed by Cloudflare Rate Limiting
  rules and/or a Durable Object counter before public forms go live.
- **Turnstile verification** — server-side token verification on
  employer enquiry, worker registration, contact form, job application.
- **Secure file upload & signed URLs** — uploads validated
  (type/size) before writing to R2; downloads only via short-lived
  signed URLs issued by an authenticated route, never a public bucket
  URL.
- **SQL injection protection** — all D1 queries use parameterized
  statements (`.bind()`), never string-concatenated SQL.
- **XSS protection** — React's default escaping plus the CSP above;
  no `dangerouslySetInnerHTML` without a specific, reviewed reason.
- **Audit logging** — the `audit_logs` table (see `schema.sql`) records
  who did what to which entity, for admin/CRM actions.
- **Secret management** — all secrets via `wrangler secret put` /
  Cloudflare dashboard; `.dev.vars` is git-ignored;
  `.dev.vars.example` documents required names with empty values.

## Data handling

Worker personal data and documents are privacy-sensitive by nature.
Baseline commitments (expanded as the CRM is built):

- Collect only what recruitment, workforce management, communication,
  and employment/compliance requirements actually need.
- No worker personal information or documents are ever exposed via
  public URLs.
- PF/ESIC-related data is stored and handled only to the extent
  applicable to the actual employment arrangement and statutory
  requirements — never assumed or fabricated.
