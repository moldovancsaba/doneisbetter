// vitest.config.ts
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths'; // For handling '@/' aliases

export default defineConfig({
  plugins: [tsconfigPaths()], // Use plugin to read paths from tsconfig.json
  test: {
    globals: true, // Use globals like jest (describe, it, expect)
    environment: 'node', // Set environment to node
    // coverage: { // Optional: Configure coverage
    //   provider: 'v8',
    //   reporter: ['text', 'json', 'html'],
    // },
    setupFiles: ['./src/tests/setup.ts'], // Load env vars before tests
    include: ['src/**/*.test.ts?(x)'], // Specify where to find tests
    // Exclude node_modules and .next
    exclude: [
        'node_modules/**',
        '.next/**',
    ],
    // Allow mocking of modules
    mockReset: true,
    clearMocks: true,
  },
});
