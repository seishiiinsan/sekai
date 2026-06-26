import "server-only";
import { createCipheriv, createDecipheriv, createHash, createHmac } from "crypto";

/**
 * Opaque flag tokens (spec §11 anti-cheat). In flags mode the image URL must not
 * reveal which country it is — flagcdn URLs embed the ISO code, so a player can
 * read the answer from the network tab. We encrypt `${sessionId}:${countryId}`
 * with AES-256-GCM and serve flags through /api/flag/<token>:
 *
 *  - opaque: the token reveals nothing without the server key;
 *  - unforgeable: the GCM tag rejects tampering;
 *  - session-scoped: the same flag yields a different token in another session,
 *    so tokens learnt in one game are useless in the next.
 *
 * Token layout (base64url): iv(12) ‖ tag(16) ‖ ciphertext. The IV is derived
 * deterministically from the payload so a given (session, country) maps to a
 * stable URL (cacheable by next/image); it is also stored in the token so the
 * payload can be recovered on decrypt. The key never leaves the server.
 */

const IV_LEN = 12;
const TAG_LEN = 16;

function key(): Buffer {
  const secret = process.env.FLAG_TOKEN_SECRET || process.env.SUPABASE_SECRET_KEY || "";
  if (!secret) {
    throw new Error("FLAG_TOKEN_SECRET / SUPABASE_SECRET_KEY missing — cannot sign flag tokens.");
  }
  return createHash("sha256").update(secret).digest(); // 32 bytes
}

function ivFor(payload: string, k: Buffer): Buffer {
  return createHmac("sha256", k).update(`iv:${payload}`).digest().subarray(0, IV_LEN);
}

/** Encrypt an opaque, session-scoped flag token for a country. */
export function signFlagToken(sessionId: string, countryId: number): string {
  const k = key();
  const payload = `${sessionId}:${countryId}`;
  const iv = ivFor(payload, k);
  const cipher = createCipheriv("aes-256-gcm", k, iv);
  const data = Buffer.concat([cipher.update(payload, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, data]).toString("base64url");
}

/** Decrypt a flag token. Returns the country id, or null if invalid/tampered. */
export function verifyFlagToken(token: string): { sessionId: string; countryId: number } | null {
  try {
    const raw = Buffer.from(token, "base64url");
    if (raw.length <= IV_LEN + TAG_LEN) return null;
    const iv = raw.subarray(0, IV_LEN);
    const tag = raw.subarray(IV_LEN, IV_LEN + TAG_LEN);
    const data = raw.subarray(IV_LEN + TAG_LEN);
    const decipher = createDecipheriv("aes-256-gcm", key(), iv);
    decipher.setAuthTag(tag);
    const payload = Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
    const sep = payload.lastIndexOf(":");
    if (sep < 0) return null;
    const sessionId = payload.slice(0, sep);
    const countryId = Number(payload.slice(sep + 1));
    if (!sessionId || !Number.isInteger(countryId)) return null;
    return { sessionId, countryId };
  } catch {
    return null;
  }
}
