/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    // TEMPORARY: Add flag to potentially show more detailed server errors in prod build
    serverComponentsExternalPackages: ['mongoose'], // May help trace DB errors
  },
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig
