/**
 * Cloudflare Worker environment bindings.
 * Kept as a single typed contract so every route/middleware shares the
 * same understanding of what's available on `c.env`.
 */
export interface Env {
  DB: D1Database;
  // TODO: Uncomment when R2 bucket is created
  // DOCUMENTS: R2Bucket;

  ENVIRONMENT: "development" | "staging" | "production";
  ALLOWED_ORIGIN: string;

  // Secrets — set via `wrangler secret put`, never checked into source.
  TURNSTILE_SECRET_KEY: string;
  SESSION_SIGNING_SECRET: string;
  ADMIN_INVITE_SECRET: string;
}
