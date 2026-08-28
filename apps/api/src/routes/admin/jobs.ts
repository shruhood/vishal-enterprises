import { Hono } from "hono";
import type { Env } from "../../types/env";

/**
 * Admin routes for managing job listings.
 *
 * Endpoints:
 *   POST /admin/jobs        — create a new job
 *   GET  /admin/jobs        — list (unpublished too, by default desc)
 *   GET  /admin/jobs/:id    — single job detail
 *   PATCH /admin/jobs/:id   — update title/desc/industry/location/skill/published
 *   DELETE /admin/jobs/:id  — delete a job
 *
 * NOTE: The `industries` and `locations` tables are reference data.
 * New industries/locations can be created inline via slug if they
 * don't exist yet (convenience for admin data entry).
 */
export const jobsAdminRoute = new Hono<{ Bindings: Env }>();

jobsAdminRoute.post("/", async (c) => {
  try {
    const { title, industry, location, skill_level, wage, description, is_published } = await c.req.json();

    if (!title || !skill_level) return c.json({ error: "title and skill_level are required" }, 400);
    const validLevel = ["skilled", "semi_skilled", "unskilled"];
    if (!validLevel.includes(skill_level)) return c.json({ error: "Invalid skill_level" }, 400);

    // Resolve or create industry FK
    let industryId: string | null = null;
    if (industry) {
      const existing = await c.env.DB.prepare(
        `SELECT id FROM industries WHERE slug = ?1 OR name = ?1`
      ).bind(industry.toLowerCase()).first<{ id: string }>();
      if (existing) {
        industryId = existing.id;
      } else {
        industryId = crypto.randomUUID();
        await c.env.DB.prepare(
          `INSERT INTO industries (id, name, slug) VALUES (?1, ?2, ?3)`
        ).bind(industryId, industry, industry.toLowerCase()).run();
      }
    }

    // Resolve or create location FK
    let locationId: string | null = null;
    if (location) {
      const existing = await c.env.DB.prepare(
        `SELECT id FROM locations WHERE slug = ?1 OR name = ?1`
      ).bind(location.toLowerCase()).first<{ id: string }>();
      if (existing) {
        locationId = existing.id;
      } else {
        locationId = crypto.randomUUID();
        await c.env.DB.prepare(
          `INSERT INTO locations (id, name, slug) VALUES (?1, ?2, ?3)`
        ).bind(locationId, location, location.toLowerCase()).run();
      }
    }

    const id = crypto.randomUUID();
    await c.env.DB.prepare(
      `INSERT INTO jobs (id, requirement_id, title, industry_id, location_id, skill_level, wage, description, is_published, created_at, updated_at)
       VALUES (?1, NULL, ?2, ?3, ?4, ?5, ?6, ?7, ?8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
    ).bind(id, title, industryId, locationId, skill_level, wage || null, description || null, is_published ? 1 : 0).run();

    return c.json({ ok: true, id }, 201);
  } catch (e) {
    console.error("Job create error:", e);
    return c.json({ error: "Internal server error", detail: String(e) }, 500);
  }
});

jobsAdminRoute.get("/", async (c) => {
  const { include_unpublished = "false" } = c.req.query();
  let stmt;
  if (include_unpublished === "true") {
    stmt = c.env.DB.prepare(
      `SELECT id, title, industry_id, location_id, skill_level, wage, description, is_published, created_at FROM jobs ORDER BY created_at DESC`
    );
  } else {
    stmt = c.env.DB.prepare(
      `SELECT id, title, industry_id, location_id, skill_level, wage, description, is_published, created_at FROM jobs WHERE is_published = 1 ORDER BY created_at DESC`
    );
  }
  const { results } = await stmt.all();
  return c.json({ jobs: results });
});

jobsAdminRoute.get("/:id", async (c) => {
  const { id } = c.req.param();
  const job = await c.env.DB.prepare(
    `SELECT * FROM jobs WHERE id = ?1`
  ).bind(id).first();
  if (!job) return c.json({ error: "Not found" }, 404);
  return c.json({ job });
});

jobsAdminRoute.patch("/:id", async (c) => {
  const { id } = c.req.param();
  const { title, skill_level, wage, description, is_published } = await c.req.json();

  const validLevel = ["skilled", "semi_skilled", "unskilled"];
  if (skill_level && !validLevel.includes(skill_level)) return c.json({ error: "Invalid skill_level" }, 400);

  const updates: string[] = [];
  const bindings: unknown[] = [];

  if (title) { updates.push(`title = ?${bindings.length + 1}`); bindings.push(title); }
  if (wage !== undefined && wage !== null) { updates.push(`wage = ?${bindings.length + 1}`); bindings.push(wage); }
  if (description !== undefined && description !== null) { updates.push(`description = ?${bindings.length + 1}`); bindings.push(description); }
  if (is_published !== undefined) { updates.push(`is_published = ?${bindings.length + 1}`); bindings.push(is_published ? 1 : 0); }
  if (skill_level) { updates.push(`skill_level = ?${bindings.length + 1}`); bindings.push(skill_level); }

  if (updates.length === 0) return c.json({ error: "Nothing to update" }, 400);

  bindings.push(id);
  await c.env.DB.prepare(
    `UPDATE jobs SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ?${bindings.length}`
  ).bind(...bindings).run();

  return c.json({ ok: true });
});

jobsAdminRoute.delete("/:id", async (c) => {
  const { id } = c.req.param();
  await c.env.DB.prepare(`DELETE FROM jobs WHERE id = ?1`).bind(id).run();
  return c.json({ ok: true });
});
