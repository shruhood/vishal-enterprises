/**
 * Authentication helpers for the Vishal Enterprises admin panel.
 *
 * Password hashing: PBKDF2-SHA256 (salted, async via crypto.subtle).
 *
 * Session & invite tokens: HMAC-SHA256-signed "JWT-lite" tokens.
 * Format: base64(payload_json).base64(hmac_sha256(secret, body))
 * Signed with SESSION_SIGNING_SECRET so tokens can't be forged.
 * No external libs — Web Crypto only.
 *
 * In the Workers runtime, crypto.subtle is async-only. All token
 * functions that use HMAC are therefore async and must be awaited.
 */

/** PBKDF2 parameters */
const ITERATIONS = 100_000;
const SALT_LEN = 16;

/** Lifetimes */
const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours
const INVITE_TTL_SECONDS = 60 * 60; // 1 hour

// ---------------------------------------------------------------------------
// Password hashing (async — must be awaited)
// ---------------------------------------------------------------------------

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LEN));
  const key = await _deriveKey(password, salt, ITERATIONS, 256);
  return `pbkdf2_sha256$${ITERATIONS}$${_bufToB64(salt)}$${_bufToB64(key)}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  try {
    const [algo, iterStr, saltB64, hashB64] = stored.split("$");
    if (algo !== "pbkdf2_sha256") return false;
    const iterations = Number(iterStr);
    const salt = _fromB64(saltB64);
    const expected = _fromB64(hashB64);
    const key = await _deriveKey(password, salt, iterations, expected.byteLength * 8);
    return _safeEqual(key, expected);
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Session tokens (async — uses crypto.subtle HMAC)
// ---------------------------------------------------------------------------

export async function signSession(
  userId: string,
  role: "admin" | "staff",
  secret: string
): Promise<string> {
  const payload = {
    userId,
    role,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  return _sign(payload, secret);
}

export interface SessionPayload {
  userId: string;
  role: "admin" | "staff";
  exp: number;
}

export async function verifySession(token: string, secret: string): Promise<SessionPayload> {
  const payload = (await _verify(token, secret)) as unknown as SessionPayload;
  if (payload.exp < Math.floor(Date.now() / 1000)) throw new Error("Token expired");
  if (payload.role !== "admin" && payload.role !== "staff") throw new Error("Invalid role");
  return payload;
}

// ---------------------------------------------------------------------------
// Invite tokens (async)
// ---------------------------------------------------------------------------

export async function generateInviteToken(
  email: string,
  secret: string,
  role: "admin" | "staff" = "admin",
  ttlSeconds: number = INVITE_TTL_SECONDS
): Promise<string> {
  const payload = {
    email,
    role,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };
  return _sign(payload, secret);
}

export interface InvitePayload {
  email: string;
  role: "admin" | "staff";
  exp: number;
}

export async function verifyInviteToken(token: string, secret: string): Promise<InvitePayload> {
  const payload = (await _verify(token, secret)) as unknown as InvitePayload;
  if (payload.exp > 0 && payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error("Invite expired");
  }
  return payload;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

async function _deriveKey(
  password: string,
  salt: Uint8Array,
  iterations: number,
  keyLenBits: number
): Promise<Uint8Array> {
  const enc = new TextEncoder();
  const pwKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );
  const derived = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
    pwKey,
    keyLenBits
  );
  return new Uint8Array(derived);
}

async function _hmacSha256(message: string, secret: string): Promise<Uint8Array> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return new Uint8Array(sig);
}

function _fromB64(b64: string): Uint8Array {
  const pad = b64.length % 4;
  const padded = pad === 0 ? b64 : b64 + "=".repeat(4 - pad);
  const bin = atob(padded);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}

function _bufToB64(buf: Uint8Array): string {
  let bin = "";
  const chunk = 0x8000;
  for (let i = 0; i < buf.length; i += chunk) {
    bin += String.fromCharCode(...Array.from(buf.subarray(i, i + chunk)));
  }
  return btoa(bin);
}

function _safeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.byteLength !== b.byteLength) return false;
  let result = 0;
  for (let i = 0; i < a.byteLength; i++) result |= a[i] ^ b[i];
  return result === 0;
}

async function _sign(payload: Record<string, unknown>, secret: string): Promise<string> {
  const body = btoa(JSON.stringify(payload));
  const sig = await _hmacSha256(body, secret);
  return `${body}.${_bufToB64(sig)}`;
}

async function _verify(token: string, secret: string): Promise<Record<string, unknown>> {
  const [body, sigB64] = token.split(".");
  if (!body || !sigB64) throw new Error("Malformed token");
  const expected = await _hmacSha256(body, secret);
  const provided = _fromB64(sigB64);
  if (!_safeEqual(expected, provided)) throw new Error("Invalid signature");
  const payload = _tryParseJson(atob(body));
  if (!payload || typeof payload !== "object") throw new Error("Invalid payload");
  return payload as Record<string, unknown>;
}

function _tryParseJson(str: string): unknown {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}
