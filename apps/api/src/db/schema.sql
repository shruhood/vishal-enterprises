-- ============================================================================
-- Vishal Enterprises — Planned D1 Schema (Phase 0: documentation only)
-- ============================================================================
-- This file documents the target schema for future phases. It is NOT
-- applied automatically. When the CRM/admin phase begins, this will be
-- split into ordered migration files under a `migrations/` folder and
-- run with `wrangler d1 migrations apply`.
--
-- Conventions:
--   - All primary keys are TEXT (UUID) for portability and to avoid
--     leaking sequential record counts (e.g. worker counts) externally.
--   - All tables have created_at / updated_at for auditability.
--   - Foreign keys use ON DELETE RESTRICT by default to avoid silent
--     data loss; specific cases may relax this later.
-- ============================================================================

-- ---- Auth & admin ----------------------------------------------------------

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'staff')),
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  metadata TEXT, -- JSON blob
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);

-- ---- Core reference data ---------------------------------------------------

CREATE TABLE IF NOT EXISTS industries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE IF NOT EXISTS locations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

-- ---- Employers & requirements ----------------------------------------------

CREATE TABLE IF NOT EXISTS employers (
  id TEXT PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_name TEXT,
  phone TEXT,
  email TEXT,
  industry_id TEXT REFERENCES industries(id),
  location_id TEXT REFERENCES locations(id),
  status TEXT NOT NULL DEFAULT 'lead' CHECK (status IN ('lead', 'active', 'inactive')),
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);
CREATE INDEX IF NOT EXISTS idx_employers_status ON employers(status);

CREATE TABLE IF NOT EXISTS enquiries (
  id TEXT PRIMARY KEY,
  employer_id TEXT REFERENCES employers(id),
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'closed')),
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);

CREATE TABLE IF NOT EXISTS requirements (
  id TEXT PRIMARY KEY,
  employer_id TEXT NOT NULL REFERENCES employers(id),
  industry_id TEXT REFERENCES industries(id),
  location_id TEXT REFERENCES locations(id),
  skill_level TEXT NOT NULL CHECK (skill_level IN ('skilled', 'semi_skilled', 'unskilled')),
  role_title TEXT NOT NULL,
  workers_needed INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'fulfilled', 'cancelled')),
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);
CREATE INDEX IF NOT EXISTS idx_requirements_status ON requirements(status);
CREATE INDEX IF NOT EXISTS idx_requirements_employer ON requirements(employer_id);

-- ---- Workers ----------------------------------------------------------------

CREATE TABLE IF NOT EXISTS workers (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  location_id TEXT REFERENCES locations(id),
  skill_level TEXT NOT NULL CHECK (skill_level IN ('skilled', 'semi_skilled', 'unskilled')),
  status TEXT NOT NULL DEFAULT 'registered'
    CHECK (status IN ('registered', 'verified', 'available', 'shortlisted', 'assigned', 'active', 'inactive')),
  pf_applicable INTEGER NOT NULL DEFAULT 0,
  esic_applicable INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);
CREATE INDEX IF NOT EXISTS idx_workers_status ON workers(status);
CREATE INDEX IF NOT EXISTS idx_workers_skill_level ON workers(skill_level);

CREATE TABLE IF NOT EXISTS worker_skills (
  id TEXT PRIMARY KEY,
  worker_id TEXT NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  years_experience INTEGER,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);
CREATE INDEX IF NOT EXISTS idx_worker_skills_worker ON worker_skills(worker_id);

-- worker_documents stores metadata + R2 object keys only.
-- The actual file bytes live in the private R2 "vishal-documents" bucket
-- and are served exclusively via signed URLs from authenticated routes.
CREATE TABLE IF NOT EXISTS worker_documents (
  id TEXT PRIMARY KEY,
  worker_id TEXT NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('resume', 'id_proof', 'certificate', 'other')),
  r2_object_key TEXT NOT NULL,
  uploaded_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);
CREATE INDEX IF NOT EXISTS idx_worker_documents_worker ON worker_documents(worker_id);

-- ---- Jobs, applications, deployments ----------------------------------------

CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,
  requirement_id TEXT REFERENCES requirements(id),
  title TEXT NOT NULL,
  industry_id TEXT REFERENCES industries(id),
  location_id TEXT REFERENCES locations(id),
  skill_level TEXT NOT NULL CHECK (skill_level IN ('skilled', 'semi_skilled', 'unskilled')),
  description TEXT,
  is_published INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);
CREATE INDEX IF NOT EXISTS idx_jobs_published ON jobs(is_published);

CREATE TABLE IF NOT EXISTS job_applications (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL REFERENCES jobs(id),
  worker_id TEXT NOT NULL REFERENCES workers(id),
  status TEXT NOT NULL DEFAULT 'applied'
    CHECK (status IN ('applied', 'shortlisted', 'rejected', 'hired')),
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);
CREATE INDEX IF NOT EXISTS idx_job_applications_job ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_worker ON job_applications(worker_id);

CREATE TABLE IF NOT EXISTS requirement_workers (
  id TEXT PRIMARY KEY,
  requirement_id TEXT NOT NULL REFERENCES requirements(id),
  worker_id TEXT NOT NULL REFERENCES workers(id),
  status TEXT NOT NULL DEFAULT 'proposed'
    CHECK (status IN ('proposed', 'accepted', 'declined', 'deployed')),
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_requirement_workers_unique ON requirement_workers(requirement_id, worker_id);

CREATE TABLE IF NOT EXISTS deployments (
  id TEXT PRIMARY KEY,
  requirement_id TEXT NOT NULL REFERENCES requirements(id),
  worker_id TEXT NOT NULL REFERENCES workers(id),
  employer_id TEXT NOT NULL REFERENCES employers(id),
  start_date TEXT NOT NULL,
  end_date TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'replaced')),
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);
CREATE INDEX IF NOT EXISTS idx_deployments_employer ON deployments(employer_id);
CREATE INDEX IF NOT EXISTS idx_deployments_worker ON deployments(worker_id);

-- ---- Website content & misc --------------------------------------------------

CREATE TABLE IF NOT EXISTS contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  message TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY,
  author_name TEXT NOT NULL,
  author_role TEXT,
  quote TEXT NOT NULL,
  is_published INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE IF NOT EXISTS faqs (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS site_content (
  id TEXT PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL, -- JSON blob
  updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);
