import { Hono } from "hono";
import type { Env, AdminContext } from "../../types/env";

/**
 * Admin routes for managing employer enquiries (manpower requests).
 *
 * Endpoints:
 *   GET /admin/enquiries              — list with optional status filter
 *   GET /admin/enquiries/:id          — single enquiry detail
 *   PATCH /admin/enquiries/:id/status — update enquiry status
 *
 * Status values: new | contacted | converted | closed
 */
export const enquiriesAdminRoute = new Hono<{ Bindings: Env; Variables: AdminContext }>();

enquiriesAdminRoute.get("/", async (c) => {
  const { status, limit = "50" } = c.req.query();
  const q = Math.min(Number(limit) || 50, 200);

  let stmt = c.env.DB.prepare(
    `SELECT id, company_name, contact_name, phone, email, message, status, created_at FROM enquiries`
  );

  const validStatus = ["new", "contacted", "converted", "closed"];
  if (status && validStatus.includes(status)) {
    stmt = c.env.DB.prepare(
      `SELECT id, company_name, contact_name, phone, email, message, status, created_at FROM enquiries WHERE status = ?1 ORDER BY created_at DESC LIMIT ?2`
    );
    const { results } = await stmt.bind(status, q).all();
    return c.json({ enquiries: results });
  }

  const paged = c.env.DB.prepare(
    `SELECT id, company_name, contact_name, phone, email, message, status, created_at FROM enquiries ORDER BY created_at DESC LIMIT ?1`
  );
  const { results } = await paged.bind(q).all();
  return c.json({ enquiries: results });
});

enquiriesAdminRoute.get("/:id", async (c) => {
  const { id } = c.req.param();
  const enquiry = await c.env.DB.prepare(
    `SELECT id, company_name, contact_name, phone, email, message, status, created_at FROM enquiries WHERE id = ?1`
  ).bind(id).first();

  if (!enquiry) return c.json({ error: "Not found" }, 404);
  return c.json({ enquiry });
});

enquiriesAdminRoute.patch("/:id/status", async (c) => {
  const { id } = c.req.param();
  const { status } = await c.req.json();

  const valid = ["new", "contacted", "converted", "closed"];
  if (!valid.includes(status)) return c.json({ error: "Invalid status" }, 400);

  const { success } = await c.env.DB.prepare(
    `UPDATE enquiries SET status = ?1 WHERE id = ?2`
  ).bind(status, id).run();

  if (!success) return c.json({ error: "Update failed" }, 500);
  return c.json({ ok: true });
});
