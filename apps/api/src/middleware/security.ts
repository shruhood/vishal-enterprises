import type { MiddlewareHandler } from "hono";
import type { Env } from "../types/env";

/**
 * Baseline security headers applied to every response. CSP is intentionally
 * conservative — tighten further once real third-party origins (fonts,
 * analytics) are finalized.
 */
export const securityHeaders: MiddlewareHandler<{ Bindings: Env }> = async (c, next) => {
  await next();
  c.header("X-Content-Type-Options", "nosniff");
  c.header("X-Frame-Options", "DENY");
  c.header("Referrer-Policy", "strict-origin-when-cross-origin");
  c.header("Permissions-Policy", "geolocation=(), camera=(), microphone=()");
  c.header(
    "Content-Security-Policy",
    "default-src 'self'; frame-ancestors 'none'; base-uri 'self'"
  );
};

/**
 * CORS restricted to the configured frontend origin only — the API is not
 * intended to be called from arbitrary third-party origins.
 */
export const corsPolicy: MiddlewareHandler<{ Bindings: Env }> = async (c, next) => {
  const origin = c.env.ALLOWED_ORIGIN;
  c.header("Access-Control-Allow-Origin", origin);
  c.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  c.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  c.header("Access-Control-Allow-Credentials", "true");

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
