-- Migration number: 0007   2026-08-28
-- Add optional B2B enquiry detail columns so the dedicated
-- /request-workforce form can capture project-specific requirements
-- without losing the original minimal enquiry contract.
-- Guards make this safe to re-run (idempotent).
ALTER TABLE enquiries ADD COLUMN job_category TEXT;
ALTER TABLE enquiries ADD COLUMN workforce_size TEXT;
ALTER TABLE enquiries ADD COLUMN deployment_date TEXT;
ALTER TABLE enquiries ADD COLUMN project_location TEXT;
