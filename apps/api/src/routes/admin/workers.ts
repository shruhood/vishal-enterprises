import { Hono } from "hono";
import type { Env, AdminContext } from "../../types/env";

/**
 * Admin routes for managing worker registrations.
 *
 * All routes require a valid admin session cookie. Mount under
 * /admin/* and gate with the `requireAdmin` middleware defined
 * in index.ts.
 *
 * Endpoints:
 *   GET  /admin/workers              — list with optional search + status filter
 *   GET  /admin/workers/:id          — single worker detail (with skills)
 *   PATCH /admin/workers/:id/status  — update worker status
 */
export const workersAdminRoute = new Hono<{ Bindings: Env; Variables: AdminContext }>();

workersAdminRoute.get("/", async (c) => {
  const { search, status, limit = "50" } = c.req.query();
  const q = Math.min(Number(limit) || 50, 200);

  let stmt = c.env.DB.prepare(
    `SELECT id, full_name, phone, email, skill_level, status, location_free, pf_applicable, esic_applicable, created_at FROM workers`
  );

  const conditions: string[] = [];
  const bindings: unknown[] = [];
  let idx = 1;

  if (search) {
    conditions.push(`(full_name LIKE ?${idx} OR phone LIKE ?${idx})`);
    const term = `%${search}%`;
    bindings.push(term, term);
    idx += 2;
  }

  if (status && /^(registered|verified|available|shortlisted|assigned|inactive)$/.test(status)) {
    conditions.push(`status = ?${idx}`);
    bindings.push(status);
    idx++;
  }

  if (conditions.length) {
    stmt = c.env.DB.prepare(
      `SELECT id, full_name, phone, email, skill_level, status, location_free, pf_applicable, esic_applicable, created_at FROM workers WHERE ${conditions.join(" AND ")} ORDER BY created_at DESC LIMIT ?${idx}`
    );
  } else {
    stmt = c.env.DB.prepare(
      `SELECT id, full_name, phone, email, skill_level, status, location_free, pf_applicable, esic_applicable, created_at FROM workers ORDER BY created_at DESC LIMIT ?${idx}`
    );
  }

  const { results } = await stmt.bind(...bindings, q).all();
  return c.json({ workers: results });
});

workersAdminRoute.get("/:id", async (c) => {
  try {
    const { id } = c.req.param();
    const worker = await c.env.DB.prepare(
      `SELECT id, full_name, phone, email, skill_level, status, location_free, pf_applicable, esic_applicable, experience_years, created_at FROM workers WHERE id = ?1`
    ).bind(id).first();

    if (!worker) return c.json({ error: "Not found" }, 404);

    const { results: skills } = await c.env.DB.prepare(
      `SELECT skill_name, years_experience FROM worker_skills WHERE worker_id = ?1 ORDER BY created_at DESC`
    ).bind(id).all();

    const { results: docs } = await c.env.DB.prepare(
      `SELECT document_type, uploaded_at FROM worker_documents WHERE worker_id = ?1 ORDER BY uploaded_at DESC`
    ).bind(id).all();

    return c.json({ worker, skills, documents: docs });
  } catch (e) {
    console.error("Worker detail error:", e);
    return c.json({ error: "Internal server error", detail: String(e) }, 500);
  }
});

workersAdminRoute.patch("/:id/status", async (c) => {
  const { id } = c.req.param();
  const { status } = await c.req.json();

  const valid = ["registered", "verified", "available", "shortlisted", "assigned", "inactive"] as const;
  if (!valid.includes(status)) return c.json({ error: "Invalid status" }, 400);

  const { success } = await c.env.DB.prepare(
    `UPDATE workers SET status = ?1, updated_at = CURRENT_TIMESTAMP WHERE id = ?2`
  ).bind(status, id).run();

  if (!success) return c.json({ error: "Update failed" }, 500);
  return c.json({ ok: true });
});
