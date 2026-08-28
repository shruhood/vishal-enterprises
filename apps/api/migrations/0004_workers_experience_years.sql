-- Migration number: 0004 	 2026-08-28T10:00:00.000Z
-- ============================================================================
-- Add experience_years column to workers (missing from initial schema).
-- ============================================================================
ALTER TABLE workers ADD COLUMN experience_years INTEGER;
