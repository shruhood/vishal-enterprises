-- Migration number: 0002 	 2026-08-28T07:01:00.000Z
-- ============================================================================
-- Add free-text location capture on workers.
--
-- Public self-registration accepts a free-text location string ("Daman",
-- "Vapi", etc.). The schema's `location_id` is a foreign key to the
-- `locations` table, so we don't write to it from the public form — a
-- staff member maps the free text to a real location row later. We still
-- want to capture what the worker actually typed so we don't lose data.
-- ============================================================================

ALTER TABLE workers ADD COLUMN location_free TEXT;
