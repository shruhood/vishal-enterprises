import { Hono, type Context } from "hono";
import { setCookie, getCookie, deleteCookie } from "hono/cookie";
import type { Env } from "../types/env";
import { verifyPassword, generateInviteToken, verifyInviteToken, signSession, verifySession, hashPassword } from "../lib/auth";
import { newId } from "../lib/id";

/**
 * Authentication routes for the Vishal Enterprises admin panel.
 *
 * Flow:
 *   1. Admin visits dashboard → redirected to /auth/login if no valid cookie
 *   2. Staff logs in with email + password → session cookie set
 *   3. New staff invited via token → /auth/invite?token=... → creates account
 *   4. /auth/me → returns current session (used by client side nav)
 *   5. /auth/logout → clears cookie
 */
export const authRoute = new Hono<{ Bindings: Env }>();

const SESSION_COOKIE = "ve_session";

authRoute.get("/login", (c) => {
  // Return a simple HTML form for manual login
  return c.html(`<!doctype html>
<html><head><title>Login — Vishal Enterprises Admin</title>
<style>
  body { font-family: sans-serif; max-width: 480px; margin: 4rem auto; padding: 0 1rem; }
  input { display: block; width: 100%; padding: .5rem; margin: .5rem 0; border: 1px solid #ccc; border-radius: 4px; }
  button { background: #EA6A12; color: white; border: none; padding: .5rem 1rem; border-radius: 4px; cursor: pointer; }
  button:hover { background: #D85A00; }
</style></head><body>
<h1>Admin Login</h1>
<form method="POST" action="/auth/login">
  <label>Email <input type="email" name="email" required></label>
  <label>Password <input type="password" name="password" required></label>
  <button type="submit">Log in</button>
</form>
</body></html>`);
});

async function authenticate(c: Context<{ Bindings: Env }>, email: string, password: string) {
  const user = await c.env.DB.prepare(
    "SELECT id, email, password_hash, role, is_active FROM users WHERE email = ?1"
  ).bind(email).first<{
    id: string;
    email: string;
    password_hash: string;
    role: "admin" | "staff";
    is_active: boolean;
  }>();

  if (!user) {
    return { error: "Invalid email or password." };
  }
  if (!user.is_active) {
    return { error: "Account is inactive." };
  }
  if (!(await verifyPassword(password, user.password_hash))) {
    return { error: "Invalid email or password." };
  }
  return { user };
}

authRoute.post("/login", async (c) => {
  const contentType = c.req.header("content-type") || "";

  if (contentType.includes("application/json")) {
    const { email, password } = await c.req.json();
    const result = await authenticate(c, email, password);
    if ("error" in result) return c.json({ error: result.error }, 401);

    const token = await signSession(result.user.id, result.user.role, c.env.SESSION_SIGNING_SECRET);
    setCookie(c, SESSION_COOKIE, token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 hours
    });
    return c.json({ ok: true, role: result.user.role });
  }

  // Form-encoded (HTML login form)
  const body = await c.req.formData();
  const email = body.get("email") as string;
  const password = body.get("password") as string;
  const result = await authenticate(c, email, password);
  if ("error" in result) {
    return c.html(`<!doctype html><html><body><h1>Login failed</h1><p>${result.error}</p><a href="/auth/login">Try again</a></body></html>`, 401);
  }

  const token = await signSession(result.user.id, result.user.role, c.env.SESSION_SIGNING_SECRET);
  setCookie(c, SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  // Redirect to dashboard
  return c.redirect("/admin", 303);
});

authRoute.post("/logout", (c) => {
  deleteCookie(c, SESSION_COOKIE, { path: "/" });
  return c.json({ ok: true });
});

authRoute.get("/me", async (c) => {
  const token = getCookie(c, SESSION_COOKIE);
  if (!token) return c.json({ authenticated: false });

  try {
    const session = await verifySession(
      token,
      c.env.SESSION_SIGNING_SECRET
    );
    return c.json({
      authenticated: true,
      userId: session.userId,
      role: session.role,
    });
  } catch {
    deleteCookie(c, SESSION_COOKIE, { path: "/" });
    return c.json({ authenticated: false });
  }
});

/**
 * Invite endpoint — generates an invite token for a new admin/staff email.
 * Only callable by an existing admin.
 */
authRoute.post("/invite", async (c) => {
  const token = getCookie(c, SESSION_COOKIE);
  if (!token) return c.json({ error: "Unauthorized" }, 401);

  try {
    const session = await verifySession(token, c.env.SESSION_SIGNING_SECRET);
    if (session.role !== "admin") return c.json({ error: "Forbidden" }, 403);

    const { email, role } = await c.req.json<{ email: string; role: "admin" | "staff" }>();
    if (!email || (role !== "admin" && role !== "staff")) {
      return c.json({ error: "Invalid email or role" }, 400);
    }
    const inviteToken = await generateInviteToken(email, c.env.ADMIN_INVITE_SECRET, role);
    return c.json({ invite_url: `/auth/accept?token=${inviteToken}` });
  } catch {
    return c.json({ error: "Unauthorized" }, 401);
  }
});

/**
 * Accept invite — verify token, create account with password.
 */
authRoute.get("/accept", async (c) => {
  const token = c.req.query("token");
  if (!token) return c.json({ error: "Missing token" }, 400);

  try {
    const payload = await verifyInviteToken(token, c.env.ADMIN_INVITE_SECRET);
    return c.html(`<!doctype html>
<html><head><title>Set password — Admin</title>
<style>
  body { font-family: sans-serif; max-width: 480px; margin: 4rem auto; padding: 0 1rem; }
  input { display: block; width: 100%; padding: .5rem; margin: .5rem 0; border: 1px solid #ccc; border-radius: 4px; }
  button { background: #EA6A12; color: white; border: none; padding: .5rem 1rem; border-radius: 4px; cursor: pointer; }
</style></head><body>
<h1>Set your password</h1>
<p>Account: ${payload.email}</p>
<form method="POST" action="/auth/accept">
  <input type="hidden" name="token" value="${token}">
  <label>New password <input type="password" name="password" required minlength="8"></label>
  <label>Confirm <input type="password" name="confirm" required minlength="8"></label>
  <button type="submit">Set password</button>
</form>
</body></html>`);
  } catch (err) {
    return c.html(`<!doctype html><html><body><h1>Invalid or expired invite</h1></body></html>`, 400);
  }
});

authRoute.post("/accept", async (c) => {
  const body = await c.req.formData();
  const token = body.get("token") as string;
  const password = body.get("password") as string;
  const confirm = body.get("confirm") as string;

  if (password !== confirm || password.length < 8) {
    return c.html(`<!doctype html><html><body><h1>Passwords do not match or too short</h1><a href="/auth/login">Login</a></body></html>`, 400);
  }

  try {
    const payload = await verifyInviteToken(token, c.env.ADMIN_INVITE_SECRET);
    const existing = await c.env.DB.prepare(
      "SELECT id FROM users WHERE email = ?1"
    ).bind(payload.email).first();
    if (existing) return c.html(`<!doctype html><html><body><h1>Account already exists</h1></body></html>`, 409);

    const id = newId();
    const passwordHash = await hashPassword(password);
    await c.env.DB.prepare(
      "INSERT INTO users (id, email, password_hash, role, is_active) VALUES (?1, ?2, ?3, ?4, 1)"
    ).bind(id, payload.email, passwordHash, payload.role).run();

    const sessionToken = await signSession(id, payload.role as "admin" | "staff", c.env.SESSION_SIGNING_SECRET);
    setCookie(c, SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    return c.redirect("/admin", 303);
  } catch {
    return c.html(`<!doctype html><html><body><h1>Invalid or expired invite</h1></body></html>`, 400);
  }
});
