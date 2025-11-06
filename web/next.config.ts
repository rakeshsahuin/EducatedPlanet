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
  // Configure server external packages to handle mongoose/mongodb properly
  serverExternalPackages: [
    'mongoose',
    'mongodb',
    'bcryptjs',
    'validator'
  ],
};

export default nextConfig;
