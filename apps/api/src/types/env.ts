/**
 * Cloudflare Worker environment bindings.
 * Kept as a single typed contract so every route/middleware shares the
 * same understanding of what's available on `c.env`.
 */
export interface Env {
  DB: D1Database;
  // Optional until R2 is enabled in the Cloudflare Dashboard and the
  // `vishal-documents` bucket is created. When absent, upload routes return
  // a clear 503 instead of crashing at typecheck/boot.
  DOCUMENTS?: R2Bucket;

  ENVIRONMENT: "development" | "staging" | "production";
  ALLOWED_ORIGIN: string;

  // Secrets — set via `wrangler secret put`, never checked into source.
  TURNSTILE_SECRET_KEY: string;
  SESSION_SIGNING_SECRET: string;
  ADMIN_INVITE_SECRET: string;
}

/**
 * Extended context type for Hono — allows `c.set("adminUser", ...)`
 * and `c.get("adminUser")` on admin routes.
 */
export interface AdminContext {
  adminUser: {
    userId: string;
    role: "admin" | "staff";
    exp: number;
  };
}
