import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Proper domain resolution for local development
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
};

export default nextConfig;
