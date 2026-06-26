import "server-only";

/**
 * Cloudflare Turnstile verification (spec §5 — bot/abuse protection on signup).
 *
 * Graceful no-op when TURNSTILE_SECRET_KEY is unset, so local/dev and key-less
 * deploys keep working; set the secret (and NEXT_PUBLIC_TURNSTILE_SITE_KEY) to
 * enforce. Returns true when the challenge passed OR when the captcha is
 * disabled, false only on an explicit failure.
 */
const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export function turnstileEnabled(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY);
}

export async function verifyTurnstile(
  token: string | null | undefined,
  remoteIp?: string | null,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // captcha disabled
  if (!token) return false;

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);

  try {
    const res = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}
