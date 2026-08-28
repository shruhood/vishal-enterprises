/**
 * API client for the Vishal Enterprises web app.
 *
 * Public endpoints (`/jobs`, `/enquiries`, `/workers/register`) are called
 * with `credentials: "include"` so Cloudflare Pages → Worker CORS works.
 *
 * Admin endpoints require the HttpOnly session cookie set by `/auth/login`.
 * The browser sends it automatically on same-origin requests. Since the
 * admin UI is served from the same Pages origin as the API proxy... actua
 * the admin pages live under `/admin/*` on the Pages site and call the
 * Worker API directly — the cookie is sent if the API is on the same
 * domain. For cross-origin (worker.dev → pages.dev) we rely on the
 * `withCredentials` + CORS `Allow-Credentials` setup already in place.
 */
import { runtimeConfig } from "../config/runtime";

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${runtimeConfig.apiBaseUrl}${path}`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.error || res.statusText, body.fields);
  }
  return res.json() as Promise<T>;
}

export async function apiPost<T>(
  path: string,
  body: unknown,
  opts: { credentials?: RequestCredentials } = {}
): Promise<T> {
  const res = await fetch(`${runtimeConfig.apiBaseUrl}${path}`, {
    method: "POST",
    credentials: opts.credentials ?? "include",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new ApiError(res.status, data.error || res.statusText, data.fields);
  }
  return res.json() as Promise<T>;
}

export async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${runtimeConfig.apiBaseUrl}${path}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new ApiError(res.status, data.error || res.statusText, data.fields);
  }
  return res.json() as Promise<T>;
}

export async function apiDelete<T>(path: string): Promise<T> {
  const res = await fetch(`${runtimeConfig.apiBaseUrl}${path}`, {
    method: "DELETE",
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new ApiError(res.status, data.error || res.statusText, data.fields);
  }
  return res.json() as Promise<T>;
}

export class ApiError extends Error {
  status: number;
  fields?: Record<string, string>;
  constructor(status: number, message: string, fields?: Record<string, string>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fields = fields;
  }
}
