/**
 * Random ID generator for primary keys. Uses Web Crypto, which is
 * available globally in the Cloudflare Workers runtime. We never need
 * to fall back to Math.random — every supported runtime exposes
 * `crypto.getRandomValues` (and `crypto.randomUUID`).
 */
export function newId(): string {
  // `crypto.randomUUID` is supported in Cloudflare Workers since 2022.
  // It is the safest, fastest, and produces a v4 UUID with the right
  // variant bits. No dependency on `globalThis.crypto` typing shenanigans.
  return crypto.randomUUID();
}
