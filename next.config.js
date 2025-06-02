/** @type {import('next').NextConfig} */
const config = {
  // Disable caching in development
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 0,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 1,
  },
  // Disable static optimization
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable response caching
  generateEtags: false,
};

export default config;

