/** @type {import('next').NextConfig} */

const nextConfig = {
  /* config options here */
  eslint: {
    // Disable ESLint during build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript type checking during build
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
