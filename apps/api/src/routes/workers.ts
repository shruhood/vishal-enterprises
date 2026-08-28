import { Hono } from "hono";
import type { Env } from "../types/env";
import { newId } from "../lib/id";
import {
  ValidationError,
  requireString,
  optionalString,
  optionalStringList,
  optionalIntInRange,
  patterns,
} from "../lib/validate";

/**
 * Public worker self-registration endpoint.
 *
 * POST /workers/register
 *   {
 *     "full_name":     string  (required, 2-200)
 *     "phone":         string  (required, phone-ish)
 *     "email":         string  (optional)
 *     "location":      string  (optional, free text)
 *     "skill_level":   "skilled" | "semi_skilled" | "unskilled"  (required)
 *     "experience_years": number (optional, 0-60)
 *     "skills":        string  (optional, comma-separated; we split & store)
 *     "pf_applicable":boolean  (optional, default false)
 *     "esic_applicable":boolean(optional, default false)
 *   }
 *
 * Inserts a `workers` row and one `worker_skills` row per named skill.
 * Public — no auth.
 */
export const workersRoute = new Hono<{ Bindings: Env }>();

const SKILL_LEVELS = new Set(["skilled", "semi_skilled", "unskilled"]);

function asBool(v: unknown): boolean {
  if (typeof v === "boolean") return v;
  if (typeof v === "string") return v === "true" || v === "1" || v === "yes" || v === "on";
  if (typeof v === "number") return v === 1;
  return false;
}

workersRoute.post("/register", async (c) => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Request body must be valid JSON." }, 400);
  }
  if (!body || typeof body !== "object") {
    return c.json({ error: "Request body must be a JSON object." }, 400);
  }
  const obj = body as Record<string, unknown>;

  const fields: Record<string, string> = {};
  const full_name = requireString(fields, obj, "full_name", {
    min: 2,
    max: 200,
    label: "Full name",
  });
  const phone = requireString(fields, obj, "phone", {
    min: 7,
    max: 20,
    pattern: patterns.phone,
    label: "Phone number",
  });
  const emailRaw = optionalString(obj, "email", { max: 200, pattern: patterns.email });
  if (obj.email != null && obj.email !== "" && emailRaw == null) {
    fields.email = "Email format is invalid.";
  }
  const location_free = optionalString(obj, "location", { max: 100 });

  // skill_level is an enum, not free text — revalidate here.
  const skill_level_raw = requireString(fields, obj, "skill_level", {
    min: 1,
    max: 20,
    label: "Skill level",
  });
  let skill_level: string | null = null;
  if (skill_level_raw) {
    if (!SKILL_LEVELS.has(skill_level_raw)) {
      fields.skill_level = "Skill level must be Skilled, Semi-skilled, or Unskilled.";
    } else {
      skill_level = skill_level_raw;
    }
  }

  const experience_years = optionalIntInRange(obj, "experience_years", 0, 60);
  if (obj.experience_years != null && obj.experience_years !== "" && experience_years == null) {
    fields.experience_years = "Experience must be a whole number between 0 and 60.";
  }
  const skills = optionalStringList(obj, "skills");
  const pf_applicable = asBool(obj.pf_applicable);
  const esic_applicable = asBool(obj.esic_applicable);

  if (Object.keys(fields).length > 0) {
    throw new ValidationError("Some fields need attention.", fields);
  }

  const now = new Date().toISOString();
  const workerId = newId();

  const statements = [
    c.env.DB.prepare(
      `INSERT INTO workers
         (id, full_name, phone, email, skill_level, status, pf_applicable, esic_applicable, location_free, created_at, updated_at)
       VALUES (?1, ?2, ?3, ?4, ?5, 'registered', ?6, ?7, ?8, ?9, ?9)`
    ).bind(
      workerId,
      full_name!,
      phone!,
      emailRaw,
      skill_level!,
      pf_applicable ? 1 : 0,
      esic_applicable ? 1 : 0,
      location_free,
      now
    ),
  ];

  for (const skillName of skills) {
    statements.push(
      c.env.DB.prepare(
        `INSERT INTO worker_skills (id, worker_id, skill_name, years_experience, created_at)
         VALUES (?1, ?2, ?3, ?4, ?5)`
      ).bind(newId(), workerId, skillName, experience_years, now)
    );
  }

  // `location_free` is the worker's typed value; admin staff can later
  // map it to a real `locations` row.

  await c.env.DB.batch(statements);

  return c.json(
    {
      ok: true,
      worker_id: workerId,
      skills_recorded: skills.length,
      message:
        "Thank you. Your registration has been received. Our team will contact you when a suitable opening arises.",
    },
    201
  );
});
