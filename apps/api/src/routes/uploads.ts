import { Hono } from "hono";
import type { Env, AdminContext } from "../types/env";
import { newId } from "../lib/id";

/**
 * Worker document upload routes (R2-backed, private).
 *
 * Files are uploaded by POSTing raw bytes directly to this Worker (which then
 * streams them into R2 via store.put). No public R2 access and no presigned
 * URLs required — this works on all workers-types versions and keeps the
 * bucket fully private.
 *
 * Endpoints (all under /admin, require admin session):
 *   POST /admin/workers/:id/documents
 *        multipart/form-data: field "file" + text field "document_type"
 *        returns { ok, id, key }
 *   GET  /admin/workers/:id/documents
 *        lists registered documents for the worker
 *   GET  /admin/workers/:id/documents/:docId
 *        streams the file bytes back (Content-Type from stored object)
 *
 * The DOCUMENTS R2 binding must be uncommented in wrangler.toml and the
 * bucket `vishal-documents` created before deploying these routes.
 */
export const uploadsRoute = new Hono<{ Bindings: Env; Variables: AdminContext }>();

const VALID_DOC_TYPES = ["resume", "id_proof", "certificate", "other"] as const;

uploadsRoute.post("/:id/documents", async (c) => {
  const store = c.env.DOCUMENTS;
  if (!store) return c.json({ error: "File storage not configured (R2 disabled)" }, 503);

  const workerId = c.req.param("id");

  // Parse multipart form-data
  const form = await c.req.parseBody({ all: true });
  const file = form["file"];
  const documentType = String(form["document_type"] ?? "");

  if (!file || typeof file === "string") {
    return c.json({ error: "Missing file" }, 400);
  }
  if (!VALID_DOC_TYPES.includes(documentType as (typeof VALID_DOC_TYPES)[number])) {
    return c.json({ error: "Invalid document_type" }, 400);
  }

  const blob = file as File;
  const safeName = (blob.name || "file").replace(/[^a-zA-Z0-9._-]/g, "_");
  const key = `workers/${workerId}/${newId()}-${safeName}`;

  await store.put(key, blob.stream(), {
    httpMetadata: { contentType: blob.type || "application/octet-stream" },
  });

  const id = newId();
  await c.env.DB.prepare(
    `INSERT INTO worker_documents (id, worker_id, document_type, r2_object_key, uploaded_at)
     VALUES (?1, ?2, ?3, ?4, CURRENT_TIMESTAMP)`
  ).bind(id, workerId, documentType, key).run();

  return c.json({ ok: true, id, key }, 201);
});

uploadsRoute.get("/:id/documents", async (c) => {
  const store = c.env.DOCUMENTS;
  if (!store) return c.json({ error: "File storage not configured (R2 disabled)" }, 503);

  const workerId = c.req.param("id");
  const { results } = await c.env.DB.prepare(
    `SELECT id, document_type, r2_object_key, uploaded_at
     FROM worker_documents WHERE worker_id = ?1 ORDER BY uploaded_at DESC`
  ).bind(workerId).all<{ id: string; document_type: string; r2_object_key: string; uploaded_at: string }>();

  return c.json({ documents: results });
});

uploadsRoute.get("/:id/documents/:docId", async (c) => {
  const store = c.env.DOCUMENTS;
  if (!store) return c.json({ error: "File storage not configured (R2 disabled)" }, 503);

  const docId = c.req.param("docId");
  const row = await c.env.DB.prepare(
    `SELECT r2_object_key FROM worker_documents WHERE id = ?1`
  ).bind(docId).first<{ r2_object_key: string }>();

  if (!row) return c.json({ error: "Not found" }, 404);

  const obj = await store.get(row.r2_object_key);
  if (!obj) return c.json({ error: "Not found in storage" }, 404);

  const body = obj instanceof ReadableStream ? obj : (obj as R2ObjectBody).body;
  return new Response(body, {
    headers: {
      "Content-Type": obj.httpMetadata?.contentType ?? "application/octet-stream",
      "Content-Disposition": `inline; filename="${(obj as R2ObjectBody).key ?? "file"}"`,
      "Cache-Control": "private, max-age=300",
    },
  });
});
