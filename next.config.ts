import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Flags are SVG; next/image rejects SVG with 400 unless explicitly allowed.
    // Safe here: SVGs come from our own /api/flag proxy or flagcdn, and the CSP
    // + attachment disposition neutralise any embedded script (defence in depth).
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      // Flag images proxied via /api/flag (anti-cheat); marketing hero hits flagcdn.
      { protocol: "https", hostname: "flagcdn.com" },
    ],
  },
};

export default nextConfig;
