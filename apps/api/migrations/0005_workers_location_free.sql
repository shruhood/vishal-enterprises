-- Align workers table with app code/frontend: original schema used `location_free`.
-- The consolidated 0001 on the new account created `location_id` instead.
-- Add `location_free` so the admin listing query + AdminWorkers.tsx UI work.
ALTER TABLE workers ADD COLUMN location_free TEXT;
