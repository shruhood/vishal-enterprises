import { Hono } from "hono";
import type { Env } from "./types/env";
import { securityHeaders, corsPolicy, rateLimitPlaceholder } from "./middleware/security";
import { healthRoute } from "./routes/health";

const app = new Hono<{ Bindings: Env }>();

app.use("*", securityHeaders);
app.use("*", corsPolicy);
app.use("*", rateLimitPlaceholder);

app.route("/health", healthRoute);

// ---------------------------------------------------------------------
// Future route groups (Phase 1+), left as documentation of intent:
//
// app.route("/enquiries", enquiriesRoute);       // employer enquiries
// app.route("/workers", workersRoute);            // worker registration/profile
// app.route("/jobs", jobsRoute);                  // job listings + applications
// app.route("/admin", adminRoute);                // authenticated CRM API
// ---------------------------------------------------------------------

app.notFound((c) => c.json({ error: "Not found" }, 404));

app.onError((err, c) => {
  console.error(err);
  return c.json({ error: "Internal server error" }, 500);
});

export default app;
