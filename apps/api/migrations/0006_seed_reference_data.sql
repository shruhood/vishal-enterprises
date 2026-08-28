-- Migration number: 0006   2026-08-28
-- ============================================================================
-- Vishal Enterprises — Seed reference + demo data
-- Makes every dashboard section (workers, enquiries, jobs) show real content.
-- Idempotent: uses INSERT OR IGNORE on PRIMARY KEY / UNIQUE columns.
-- ============================================================================

-- ---- Reference: industries -------------------------------------------------
INSERT OR IGNORE INTO industries (id, name, slug) VALUES
  ('ind-constr', 'Construction', 'construction'),
  ('ind-mfg',    'Manufacturing', 'manufacturing'),
  ('ind-logi',   'Logistics & Warehousing', 'logistics'),
  ('ind-hosp',   'Hospitality', 'hospitality'),
  ('ind-it',     'IT & BPO', 'it');

-- ---- Reference: locations --------------------------------------------------
INSERT OR IGNORE INTO locations (id, name, slug) VALUES
  ('loc-silv', 'Silvassa', 'silvassa'),
  ('loc-vapi', 'Vapi', 'vapi'),
  ('loc-dnh',  'Dadra & Nagar Haveli', 'dadra-nagar-haveli'),
  ('ind-mum',  'Mumbai', 'mumbai'),
  ('ind-ahm',  'Ahmedabad', 'ahmedabad');

-- ---- Employers -------------------------------------------------------------
INSERT OR IGNORE INTO employers (id, company_name, contact_name, phone, email, industry_id, location_id, status) VALUES
  ('emp-001', 'Shree Krishna Builders', 'Ramesh Patel', '+91-98250-11223', 'hr@shreekrishna.example', 'ind-constr', 'loc-vapi', 'active'),
  ('emp-002', 'Gujarat Polyfilms Pvt Ltd', 'Sneha Desai', '+91-99740-33445', 'ops@gujaratpoly.example', 'ind-mfg', 'loc-silv', 'active'),
  ('emp-003', 'Express Logistics Hub', 'Imran Sheikh', '+91-90165-77889', 'careers@expresslogi.example', 'ind-logi', 'loc-dnh', 'lead');

-- ---- Enquiries (website contact form) -------------------------------------
INSERT OR IGNORE INTO enquiries (id, employer_id, company_name, contact_name, phone, email, message, status) VALUES
  ('enq-001', NULL, 'Patel Infrastructure', 'Manoj Patel', '+91-98980-22110', 'manoj@patelinfra.example', 'Need 25 unskilled labourers for a 3-month road project in Vapi.', 'new'),
  ('enq-002', 'emp-002', 'Gujarat Polyfilms Pvt Ltd', 'Sneha Desai', '+91-99740-33445', 'ops@gujaratpoly.example', 'Looking for 10 semi-skilled machine operators, immediate joining.', 'contacted'),
  ('enq-003', NULL, 'Coastal Hotels', 'Aarti Nair', '+91-90870-66554', 'aarti@coastalhotels.example', 'Require 6 housekeeping staff for our Silvassa property.', 'new');

-- ---- Workers ---------------------------------------------------------------
INSERT OR IGNORE INTO workers (id, full_name, phone, email, location_id, skill_level, status, pf_applicable, esic_applicable, experience_years, location_free) VALUES
  ('wrk-001', 'Ravi Chaudhary', '+91-91234-10001', 'ravi.c@example.com', 'loc-vapi', 'skilled',       'available', 1, 1, 8,  'Vapi'),
  ('wrk-002', 'Suresh Bari',    '+91-91234-10002', NULL,                'loc-silv', 'semi_skilled',  'available', 1, 0, 4,  'Silvassa'),
  ('wrk-003', 'Deepak Rathod',  '+91-91234-10003', 'deepak.r@example.com', 'loc-dnh', 'unskilled',     'registered', 0, 0, 1,  'Dadra & Nagar Haveli'),
  ('wrk-004', 'Imtiyaz Khan',   '+91-91234-10004', NULL,                'loc-vapi', 'skilled',       'shortlisted', 1, 1, 6,  'Vapi'),
  ('wrk-005', 'Ganesh Pawar',   '+91-91234-10005', 'ganesh.p@example.com', 'loc-silv', 'semi_skilled',  'available', 1, 1, 3,  'Silvassa');

INSERT OR IGNORE INTO worker_skills (id, worker_id, skill_name, years_experience) VALUES
  ('sk-001', 'wrk-001', 'Carpentry', 8),
  ('sk-002', 'wrk-001', 'Shuttering', 5),
  ('sk-003', 'wrk-002', 'Welding', 4),
  ('sk-004', 'wrk-004', 'Electrical', 6),
  ('sk-005', 'wrk-004', 'Plumbing', 5),
  ('sk-006', 'wrk-005', 'Packaging', 3);

-- ---- Jobs (published = visible on public board + dashboard) ---------------
INSERT OR IGNORE INTO jobs (id, requirement_id, title, industry_id, location_id, skill_level, wage, description, is_published) VALUES
  ('job-001', NULL, 'Site Carpenters — Vapi', 'ind-constr', 'loc-vapi', 'skilled', '₹18,000 - ₹22,000 / month', 'Experienced carpenters for residential building project. 10 openings, immediate joining.', 1),
  ('job-002', NULL, 'Machine Operators — Silvassa', 'ind-mfg', 'loc-silv', 'semi_skilled', '₹15,000 / month', 'Semi-skilled operators for packaging line. PF + ESIC applicable.', 1),
  ('job-003', NULL, 'Warehouse Helpers — DNH', 'ind-logi', 'loc-dnh', 'unskilled', '₹12,000 / month', 'General warehouse helpers, day shift. No experience required.', 1),
  ('job-004', NULL, 'Housekeeping Staff — Silvassa', 'ind-hosp', 'loc-silv', 'unskilled', '₹11,000 / month', 'Housekeeping for hotel property. Accommodation provided.', 1);

-- ---- Deployment (one active, to exercise the deployments table) -----------
INSERT OR IGNORE INTO deployments (id, requirement_id, worker_id, employer_id, start_date, status) VALUES
  ('dep-001', NULL, 'wrk-001', 'emp-001', '2026-08-20', 'active');

-- ---- Testimonial + FAQ (website content) ---------------------------------
INSERT OR IGNORE INTO testimonials (id, author_name, author_role, quote, is_published) VALUES
  ('tm-001', 'Ramesh Patel', 'HR Manager, Shree Krishna Builders', 'Vishal Enterprises supplied skilled carpenters within 48 hours. Reliable manpower partner.', 1);

INSERT OR IGNORE INTO faqs (id, question, answer, sort_order, is_published) VALUES
  ('faq-001', 'How quickly can you provide workers?', 'Typically within 48 hours for standard skill levels, subject to availability.', 1, 1),
  ('faq-002', 'Do you handle PF/ESIC compliance?', 'Yes, for workers where PF/ESIC is applicable we manage statutory deductions and documentation.', 2, 1);
