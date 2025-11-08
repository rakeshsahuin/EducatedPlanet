/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Configure Turbopack root directory to avoid multiple lockfile warnings
  turbopack: {
    root: '../'
  },
  // Configure server external packages to handle mongoose/mongodb properly
  serverExternalPackages: [
    'mongoose',
    'mongodb',
    'bcryptjs',
    'validator'
  ],
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/dashboard/default",
        permanent: false,
      },
    ];
  },
}

export default nextConfig
