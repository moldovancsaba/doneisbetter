// src/tests/setup.ts
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local for tests
// Use ../../.env.local if setup.ts is in src/tests/
// Adjust the path based on where setup.ts is located relative to .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.warn(`Failed to load .env.local for tests from ${envPath}:`, result.error.message);
  // Optionally throw an error if .env.local is strictly required
  // throw new Error(`Could not load .env.local for tests: ${result.error.message}`);
} else {
  console.log(`Test environment loaded from ${envPath}`);
}

// You can add other global test setup here if needed
