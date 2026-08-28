import { Hono } from "hono";
import type { Env } from "../types/env";

/**
 * Public job listing routes. Only published jobs are returned.
 *
 * Endpoints:
 *   GET /jobs              — public list (all published, latest first)
 *   GET /jobs/:id          — single published job detail
 */
export const jobsPublicRoute = new Hono<{ Bindings: Env }>();

jobsPublicRoute.get("/", async (c) => {
  const { industry, location, skill_level, limit = "20" } = c.req.query();
  const q = Math.min(Number(limit) || 20, 100);

  const where: string[] = ["is_published = 1"];
  const bindings: unknown[] = [];
  let idx = 1;

  if (industry) {
    where.push(`(industry_id IN (SELECT id FROM industries WHERE slug = ?${idx} OR name = ?${idx}))`);
    const term = industry.toLowerCase();
    bindings.push(term, term);
    idx += 2;
  }

  if (location) {
    where.push(`(location_id IN (SELECT id FROM locations WHERE slug = ?${idx} OR name = ?${idx}))`);
    const term = location.toLowerCase();
    bindings.push(term, term);
    idx += 2;
  }

  if (skill_level && ["skilled", "semi_skilled", "unskilled"].includes(skill_level)) {
    where.push(`skill_level = ?${idx}`);
    bindings.push(skill_level);
    idx++;
  }

  const stmt = c.env.DB.prepare(
    `SELECT j.id, j.title, i.name as industry, l.name as location, j.skill_level, j.wage, j.description, j.created_at
     FROM jobs j
     LEFT JOIN industries i ON j.industry_id = i.id
     LEFT JOIN locations l ON j.location_id = l.id
     WHERE ${where.join(" AND ")}
     ORDER BY j.created_at DESC LIMIT ?${idx}`
  );

  const { results } = await stmt.bind(...bindings, q).all();
  return c.json({ jobs: results });
});

jobsPublicRoute.get("/:id", async (c) => {
  const { id } = c.req.param();
  const job = await c.env.DB.prepare(
    `SELECT j.id, j.title, i.name as industry, i.slug as industry_slug, l.name as location, l.slug as location_slug, j.skill_level, j.wage, j.description, j.created_at
     FROM jobs j
     LEFT JOIN industries i ON j.industry_id = i.id
     LEFT JOIN locations l ON j.location_id = l.id
     WHERE j.id = ?1 AND j.is_published = 1`
  ).bind(id).first();

  if (!job) return c.json({ error: "Not found" }, 404);
  return c.json({ job });
});
