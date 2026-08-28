import type { MiddlewareHandler } from "hono";
import type { Env } from "../types/env";

/**
 * Baseline security headers applied to every response. CSP is intentionally
 * conservative — tighten further once real third-party origins (fonts,
 * analytics) are finalized.
 */
export const securityHeaders: MiddlewareHandler<{ Bindings: Env }> = async (_c, next) => {
  await next();
};

/**
 * CORS restricted to the configured frontend origin(s) only — the API
 * is not intended to be called from arbitrary third-party origins.
 *
 * `ALLOWED_ORIGIN` may be a single origin or a comma-separated list
 * (e.g. "http://localhost:5173,https://example.pages.dev"). The
 * Access-Control-Allow-Origin header echoes the request's Origin when
 * it matches an allowed entry; otherwise no CORS response is added
 * and the browser will block the call.
 */
export const corsPolicy: MiddlewareHandler<{ Bindings: Env }> = async (c, next) => {
  const allowed = (c.env.ALLOWED_ORIGIN ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const requestOrigin = c.req.header("Origin");

  if (requestOrigin && allowed.includes(requestOrigin)) {
    c.header("Access-Control-Allow-Origin", requestOrigin);
    c.header("Vary", "Origin");
    c.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    c.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    c.header("Access-Control-Allow-Credentials", "true");
    c.header("Access-Control-Max-Age", "600");
  }

  // Common security headers on every response.
  c.header("X-Content-Type-Options", "nosniff");
  c.header("X-Frame-Options", "DENY");
  c.header("Referrer-Policy", "strict-origin-when-cross-origin");
  c.header("Permissions-Policy", "geolocation=(), camera=(), microphone=()");
  c.header(
    "Content-Security-Policy",
    "default-src 'self'; frame-ancestors 'none'; base-uri 'self'"
  );

  if (c.req.method === "OPTIONS") {
    return c.body(null, 204);
  }
  await next();
};

/**
 * Very small fixed-window rate limiter placeholder. Production should back
 * this with Cloudflare Rate Limiting rules and/or a Durable Object/KV
 * counter — this stub documents the intent for Phase 0 and is a no-op.
 */
export const rateLimitPlaceholder: MiddlewareHandler<{ Bindings: Env }> = async (_c, next) => {
  // TODO: implement per-IP / per-route rate limiting before public launch.
  await next();
};
