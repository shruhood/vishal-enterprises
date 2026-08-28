import { Hono } from "hono";
import type { Env } from "../types/env";

/**
 * Health & smoke-test routes. Used to verify the live deployment is wired up
 * end-to-end: edge → worker → D1.
 */
export const healthRoute = new Hono<{ Bindings: Env }>();

// Basic liveness probe — no bindings touched.
healthRoute.get("/", (c) => {
  return c.json({
    status: "ok",
    environment: c.env.ENVIRONMENT,
    timestamp: new Date().toISOString(),
  });
});

// DB smoke test — exercises the D1 binding by creating a table on first hit
// and reading it back. This proves the D1 binding is wired up in the deployed
// worker, not just present in wrangler.toml.
healthRoute.get("/db", async (c) => {
  try {
    // Ensure the smoke-test table exists (idempotent).
    await c.env.DB.prepare(
      "CREATE TABLE IF NOT EXISTS smoke_test (id INTEGER PRIMARY KEY AUTOINCREMENT, message TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP))"
    ).run();

    // Write a row.
    const insert = await c.env.DB.prepare(
      "INSERT INTO smoke_test (message) VALUES (?)"
    )
      .bind(`hello from worker @ ${new Date().toISOString()}`)
      .run();

    // Read it back.
    const { results } = await c.env.DB.prepare(
      "SELECT id, message, created_at FROM smoke_test ORDER BY id DESC LIMIT 5"
    ).all<{ id: number; message: string; created_at: string }>();

    return c.json({
      status: "ok",
      binding: "D1",
      lastInsertId: insert.meta.last_row_id,
      rows: results,
    });
  } catch (err) {
    return c.json(
      {
        status: "error",
        binding: "D1",
        error: err instanceof Error ? err.message : String(err),
      },
      500
    );
  }
});
