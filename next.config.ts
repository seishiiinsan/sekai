import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Flag images are served by flagcdn (keyed by ISO alpha-2).
      { protocol: "https", hostname: "flagcdn.com" },
    ],
  },
};

export default nextConfig;
