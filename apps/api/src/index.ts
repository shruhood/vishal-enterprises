import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import type { Env } from "./types/env";
import { AdminContext } from "./types/env";
import { securityHeaders, corsPolicy, rateLimitPlaceholder } from "./middleware/security";
import { healthRoute } from "./routes/health";
import { enquiriesRoute } from "./routes/enquiries";
import { workersRoute } from "./routes/workers";
import { jobsPublicRoute } from "./routes/jobs";
import { authRoute } from "./routes/auth";
import { workersAdminRoute } from "./routes/admin/workers";
import { enquiriesAdminRoute } from "./routes/admin/enquiries";
import { jobsAdminRoute } from "./routes/admin/jobs";
import { verifySession } from "./lib/auth";
import { ValidationError } from "./lib/validate";

const app = new Hono<{ Bindings: Env; Variables: AdminContext }>();

app.use("*", securityHeaders);
app.use("*", corsPolicy);
app.use("*", rateLimitPlaceholder);

// ---------------------------------------------------------------------------
// Public routes
// ---------------------------------------------------------------------------
app.route("/health", healthRoute);
app.route("/enquiries", enquiriesRoute);
app.route("/workers", workersRoute);
app.route("/jobs", jobsPublicRoute);
app.route("/auth", authRoute);

// ---------------------------------------------------------------------------
// Admin routes — protected by session cookie verification
// ---------------------------------------------------------------------------
const admin = new Hono<{ Bindings: Env; Variables: AdminContext }>();

// requireAdmin middleware: every route under /admin/* must pass through this
admin.use("*", async (c, next) => {
  const token = getCookie(c, "ve_session");
  if (!token) return c.json({ error: "Unauthorized — no session" }, 401);

  try {
    const session = await verifySession(token, c.env.SESSION_SIGNING_SECRET);
    c.set("adminUser", session);
  } catch {
    return c.json({ error: "Unauthorized — invalid session" }, 401);
  }

  await next();
});

// After auth check, require admin role specifically
admin.use("*", async (c, next) => {
  const adminUser = c.get("adminUser");
  if (!adminUser || adminUser.role !== "admin") {
    return c.json({ error: "Forbidden — admin role required" }, 403);
  }
  await next();
});

admin.route("/workers", workersAdminRoute);
admin.route("/enquiries", enquiriesAdminRoute);
admin.route("/jobs", jobsAdminRoute);

// Mount admin app under /admin
app.route("/admin", admin);

// ---------------------------------------------------------------------------
// Error handling
// ---------------------------------------------------------------------------
app.notFound((c) => c.json({ error: "Not found" }, 404));

app.onError((err, c) => {
  if (err instanceof ValidationError) {
    return c.json(
      { error: err.message, fields: err.fields },
      err.status as 400
    );
  }
  console.error(err);
  return c.json({ error: "Internal server error" }, 500);
});

export default app;
