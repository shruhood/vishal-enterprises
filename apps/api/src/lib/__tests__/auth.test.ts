import { describe, it, expect } from "vitest";
import {
  hashPassword,
  verifyPassword,
  signSession,
  verifySession,
  generateInviteToken,
  verifyInviteToken,
} from "../auth";

describe("password hashing", () => {
  it("hashes and verifies a password", async () => {
    const h = await hashPassword("secret123");
    expect(h).toMatch(/^pbkdf2_sha256\$\d+\$/);
    expect(await verifyPassword("secret123", h)).toBe(true);
    expect(await verifyPassword("wrong", h)).toBe(false);
  });

  it("produces unique hashes for the same password", async () => {
    const a = await hashPassword("same");
    const b = await hashPassword("same");
    expect(a).not.toBe(b);
    expect(await verifyPassword("same", a)).toBe(true);
    expect(await verifyPassword("same", b)).toBe(true);
  });
});

describe("session tokens", () => {
  it("signs and verifies a session token", async () => {
    const token = await signSession("user-1", "admin", "super-secret");
    const payload = await verifySession(token, "super-secret");
    expect(payload.userId).toBe("user-1");
    expect(payload.role).toBe("admin");
  });

  it("rejects a token signed with a different secret", async () => {
    const token = await signSession("user-1", "admin", "good-secret");
    await expect(verifySession(token, "bad-secret")).rejects.toThrow();
  });

  it("rejects a malformed token", async () => {
    await expect(verifySession("garbage", "secret")).rejects.toThrow();
  });
});

describe("invite tokens", () => {
  it("generates and verifies a one-time invite token", async () => {
    const secret = "invite-secret";
    const token = await generateInviteToken("admin@corp.com", secret);
    const payload = await verifyInviteToken(token, secret);
    expect(payload.email).toBe("admin@corp.com");
    expect(payload.role).toBe("admin");
  });

  it("includes an expiration (1h default)", async () => {
    const token = await generateInviteToken("admin@corp.com", "s");
    const payload = await verifyInviteToken(token, "s");
    const now = Math.floor(Date.now() / 1000);
    expect(payload.exp).toBeGreaterThan(now);
    expect(payload.exp).toBeLessThanOrEqual(now + 3610);
  });

  it("rejects an expired token", async () => {
    const secret = "invite-secret";
    const token = await generateInviteToken("admin@corp.com", secret, "admin", -10);
    await expect(verifyInviteToken(token, secret)).rejects.toThrow();
  });
});
