"use client";

import Script from "next/script";

/**
 * Cloudflare Turnstile widget for the signup form. Uses implicit rendering: the
 * script finds the .cf-turnstile div and injects a hidden `cf-turnstile-response`
 * input into the enclosing <form>, which the server action then verifies.
 *
 * Renders nothing when NEXT_PUBLIC_TURNSTILE_SITE_KEY is unset, so the form keeps
 * working before keys are configured (server verification is a no-op too).
 */
export function TurnstileWidget() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (!siteKey) return null;

  return (
    <div className="space-y-2">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="lazyOnload"
      />
      <div className="cf-turnstile" data-sitekey={siteKey} data-theme="auto" />
    </div>
  );
}
