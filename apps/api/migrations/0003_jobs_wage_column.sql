-- Migration number: 0003 	 2026-08-28T09:15:00.000Z
-- ============================================================================
-- Add wage column to jobs table (missing from initial schema).
-- ============================================================================
ALTER TABLE jobs ADD COLUMN wage TEXT;
