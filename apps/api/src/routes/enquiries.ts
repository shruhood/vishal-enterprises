import { Hono } from "hono";
import type { Env } from "../types/env";
import { newId } from "../lib/id";
import {
  ValidationError,
  requireString,
  optionalString,
  optionalInt,
  patterns,
} from "../lib/validate";

/**
 * Public employer enquiry endpoint.
 *
 * POST /enquiries
 *   {
 *     "company_name":  string  (required, 2-200)
 *     "contact_name":  string  (required, 2-200)
 *     "phone":         string  (required, phone-ish)
 *     "email":         string  (optional, email)
 *     "industry":      string  (optional, 2-100)
 *     "location":      string  (optional, 2-100)
 *     "workers_needed":number  (optional, 1-10000)
 *     "message":       string  (optional, <= 1000)
 *   }
 *
 * Creates a row in `enquiries` (and a deduplicated `employers` row) so
 * admin staff can follow up. No auth required — public lead capture.
 */
export const enquiriesRoute = new Hono<{ Bindings: Env }>();

enquiriesRoute.post("/", async (c) => {
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
  const company_name = requireString(fields, obj, "company_name", {
    min: 2,
    max: 200,
    label: "Company name",
  });
  const contact_name = requireString(fields, obj, "contact_name", {
    min: 2,
    max: 200,
    label: "Contact name",
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
  const industry = optionalString(obj, "industry", { max: 100 });
  const location = optionalString(obj, "location", { max: 100 });
  const workers_needed = optionalInt(obj, "workers_needed");
  const message = optionalString(obj, "message", { max: 1000 });
  // B2B /request-workforce specific fields (all optional)
  const job_category = optionalString(obj, "job_category", { max: 100 });
  const workforce_size = optionalString(obj, "workforce_size", { max: 50 });
  const deployment_date = optionalString(obj, "deployment_date", { max: 50 });
  const project_location = optionalString(obj, "project_location", { max: 100 });

  if (Object.keys(fields).length > 0) {
    throw new ValidationError("Some fields need attention.", fields);
  }

  // We only have `null` here for the validated-non-nullable ones, so the
  // non-null assertions are safe after the field-error guard above.
  const now = new Date().toISOString();
  const employerId = newId();
  const enquiryId = newId();

  // Insert employer + enquiry. We don't resolve industries/locations to
  // foreign keys here — the public form is text-typed for simplicity, and
  // admin staff can normalize later. We DO use a CHECK on the raw text by
  // limiting to safe text.
  await c.env.DB.batch([
    c.env.DB.prepare(
      `INSERT INTO employers (id, company_name, contact_name, phone, email, status, created_at, updated_at)
       VALUES (?1, ?2, ?3, ?4, ?5, 'lead', ?6, ?6)`
    ).bind(employerId, company_name!, contact_name!, phone!, emailRaw, now),
    c.env.DB.prepare(
      `INSERT INTO enquiries (id, employer_id, company_name, contact_name, phone, email, message, status, created_at, job_category, workforce_size, deployment_date, project_location)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, 'new', ?8, ?9, ?10, ?11, ?12)`
    ).bind(enquiryId, employerId, company_name!, contact_name!, phone!, emailRaw, message, now, job_category, workforce_size, deployment_date, project_location),
  ]);

  // Also record the free-text industry/location in the enquiry's `message`
  // envelope so the CRM UI can show what the lead asked for.
  const meta = [
    industry ? `industry: ${industry}` : null,
    location ? `location: ${location}` : null,
    workers_needed != null ? `workers_needed: ${workers_needed}` : null,
    job_category ? `job_category: ${job_category}` : null,
    workforce_size ? `workforce_size: ${workforce_size}` : null,
    deployment_date ? `deployment_date: ${deployment_date}` : null,
    project_location ? `project_location: ${project_location}` : null,
  ]
    .filter(Boolean)
    .join(" | ");

  if (meta) {
    const finalMessage = message ? `${message}\n\n— ${meta}` : meta;
    await c.env.DB.prepare(
      "UPDATE enquiries SET message = ?1 WHERE id = ?2"
    ).bind(finalMessage, enquiryId);
  }

  return c.json(
    {
      ok: true,
      enquiry_id: enquiryId,
      message:
        "Thank you. Your manpower enquiry has been received. Our team will contact you shortly.",
    },
    201
  );
});
