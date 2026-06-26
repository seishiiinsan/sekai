import "server-only";
import { createHash } from "crypto";

/**
 * Leaked-password check against HIBP Pwned Passwords (spec §5). A free, in-code
 * replacement for Supabase's Pro-only "leaked password protection".
 *
 * Uses k-anonymity: only the first 5 chars of the SHA-1 hash are sent; the full
 * password never leaves the server. The `Add-Padding` header pads the response
 * so its size can't reveal the prefix's hit count.
 *
 * Fails OPEN (returns false) on any network/parse error so a HIBP outage cannot
 * block signups — availability over strictness, the conventional trade-off.
 */
const RANGE_URL = "https://api.pwnedpasswords.com/range/";

export async function isPasswordPwned(password: string): Promise<boolean> {
  try {
    const sha1 = createHash("sha1").update(password).digest("hex").toUpperCase();
    const prefix = sha1.slice(0, 5);
    const suffix = sha1.slice(5);

    const res = await fetch(`${RANGE_URL}${prefix}`, {
      headers: { "Add-Padding": "true" },
      cache: "no-store",
    });
    if (!res.ok) return false;

    const text = await res.text();
    for (const line of text.split("\n")) {
      const [hashSuffix, countStr] = line.trim().split(":");
      // Padding entries carry a count of 0; a real breach hit has count > 0.
      if (hashSuffix === suffix) return Number(countStr) > 0;
    }
    return false;
  } catch {
    return false;
  }
}
