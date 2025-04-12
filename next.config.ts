import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Allow production builds to successfully complete even if
    // your project has type errors
    ignoreBuildErrors: true,
  },
  // Ensure we can deploy with environment variables
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
  }
};

export default nextConfig;
