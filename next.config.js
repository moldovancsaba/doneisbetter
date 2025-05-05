/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ['mongoose'],
    swcMinify: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  // Handle font loading
  webpack(config) {
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      issuer: { and: [/\.[jt]sx?$/] },
      type: 'asset/resource',
    });
    return config;
  }
};

module.exports = nextConfig;
