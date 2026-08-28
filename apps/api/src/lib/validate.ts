/**
 * Lightweight, framework-free input validation for the public form
 * endpoints (enquiries, worker registration). Designed to fail loud
 * with structured field errors the client can render next to inputs.
 *
 * We deliberately avoid pulling in a validator library — these forms
 * are short, the rules are obvious, and Hono is already on the wire.
 */

export type FieldErrors = Record<string, string>;

export class ValidationError extends Error {
  readonly status = 400;
  readonly fields: FieldErrors;
  constructor(message: string, fields: FieldErrors) {
    super(message);
    this.name = "ValidationError";
    this.fields = fields;
  }
}

const PHONE_RE = /^[+]?[\d\s()-]{7,20}$/;
// Practical email regex: not RFC-perfect, but rejects the common garbage.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Disallow control characters and cap length to keep D1 happy.
const SAFE_TEXT_RE = /^[^\x00-\x1f]{1,500}$/; // eslint-disable-line no-control-regex

export function requireString(
  fields: FieldErrors,
  obj: Record<string, unknown>,
  key: string,
  opts: { min?: number; max?: number; pattern?: RegExp; label?: string } = {}
): string | null {
  const { min = 1, max = 500, pattern, label = key } = opts;
  const raw = obj[key];
  if (raw == null || raw === "") {
    fields[key] = `${label} is required.`;
    return null;
  }
  if (typeof raw !== "string") {
    fields[key] = `${label} must be text.`;
    return null;
  }
  const trimmed = raw.trim();
  if (trimmed.length < min) {
    fields[key] = `${label} must be at least ${min} character${min === 1 ? "" : "s"}.`;
    return null;
  }
  if (trimmed.length > max) {
    fields[key] = `${label} must be at most ${max} characters.`;
    return null;
  }
  if (pattern && !pattern.test(trimmed)) {
    fields[key] = `${label} format is invalid.`;
    return null;
  }
  return trimmed;
}

export function optionalString(
  obj: Record<string, unknown>,
  key: string,
  opts: { max?: number; pattern?: RegExp } = {}
): string | null {
  const { max = 500, pattern } = opts;
  const raw = obj[key];
  if (raw == null || raw === "") return null;
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (trimmed.length > max) return null;
  if (pattern && !pattern.test(trimmed)) return null;
  return trimmed;
}

export function optionalInt(obj: Record<string, unknown>, key: string): number | null {
  const raw = obj[key];
  if (raw == null || raw === "") return null;
  const n = typeof raw === "string" ? Number(raw) : (raw as number);
  if (!Number.isFinite(n) || !Number.isInteger(n) || n < 1 || n > 10000) return null;
  return n;
}

/**
 * Accept either a string (split on commas) or a string array. Returns
 * the normalized list. Invalid entries (non-strings, control chars,
 * overlong) are silently dropped — the field is free-form.
 */
export function optionalStringList(
  obj: Record<string, unknown>,
  key: string,
  maxItems = 20
): string[] {
  const raw = obj[key];
  if (raw == null) return [];
  let arr: unknown[] = [];
  if (Array.isArray(raw)) {
    arr = raw;
  } else if (typeof raw === "string") {
    arr = raw.split(",");
  } else {
    return [];
  }
  const out: string[] = [];
  for (const item of arr) {
    if (typeof item !== "string") continue;
    const t = item.trim();
    if (t.length === 0 || t.length > 80) continue;
    if (/[\x00-\x1f]/.test(t)) continue; // eslint-disable-line no-control-regex
    out.push(t);
    if (out.length >= maxItems) break;
  }
  return out;
}

/**
 * Accept either a whole number or a numeric string. Returns null for
 * anything outside [min, max].
 */
export function optionalIntInRange(
  obj: Record<string, unknown>,
  key: string,
  min: number,
  max: number
): number | null {
  const raw = obj[key];
  if (raw == null || raw === "") return null;
  const n = typeof raw === "string" ? Number(raw) : (raw as number);
  if (!Number.isFinite(n) || !Number.isInteger(n) || n < min || n > max) return null;
  return n;
}

export const patterns = {
  phone: PHONE_RE,
  email: EMAIL_RE,
  safeText: SAFE_TEXT_RE,
};
