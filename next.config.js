/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors. We'll fix ESLint separately.
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
