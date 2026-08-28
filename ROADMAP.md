# Roadmap

## Phase 0 — Foundation (this phase)

- [x] Monorepo structure (`apps/web`, `apps/api`)
- [x] Technology selection documented (`ARCHITECTURE.md`)
- [x] Cloudflare configuration foundation (`wrangler.toml`, bindings documented)
- [x] Design token system + light/dark/system theming
- [x] Base application shell (Header, Navigation, MobileMenu, Footer, Layout)
- [x] Homepage foundation (hero, trust indicators, CTA structure, footer)
- [x] Centralized company config with placeholders
- [x] D1 schema documented (not applied)
- [x] Security/CORS/header middleware skeleton
- [x] Documentation set (this file and its siblings)

## Phase 1 — Public website content (proposed next)

- Full About, Services, Industries, Locations, Jobs, Contact pages
  (replacing the current `Placeholder` stand-ins)
- Location detail pages (`/locations/daman`, `/locations/vapi`, etc.)
- Service category detail content (skilled/semi-skilled/unskilled)
- Industry detail content
- Contact form wired to the Worker API + Turnstile + `contact_messages`

## Phase 2 — Employer & worker intake

- Employer enquiry form → `enquiries` table, admin-visible
- Worker registration flow → `workers`, `worker_skills`,
  `worker_documents` (R2 upload + signed URL retrieval)
- Job listings (public) + job application flow

## Phase 3 — Admin CRM

- Authenticated admin app (login, sessions, RBAC)
- Dashboard, Employers, Workers, Requirements, Jobs, Applications,
  Deployments, Documents management
- Industries/Locations/Content/FAQs/Testimonials management
- Settings, Audit Logs

## Phase 4 — Employer & worker portals

- Authenticated employer portal (requirement status, deployed
  workforce, replacement requests)
- Authenticated worker portal (profile, application status, documents)

## Phase 5 — Hardening & launch readiness

- Rate limiting (real implementation, replacing the current placeholder)
- Full Turnstile integration across all public forms
- Sitemap, robots.txt finalization, structured data, Open Graph
- Accessibility audit pass
- Load/security review before go-live

## Non-goals for now

- No real company data (phone numbers, registration IDs, testimonials,
  client names) will be added anywhere until explicitly supplied —
  placeholders stay until replaced with real values.
