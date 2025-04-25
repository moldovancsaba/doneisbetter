// jest.config.js - Reverting to next/jest
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const customJestConfig = {
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  roots: ['<rootDir>/src'], // Keep roots setting
  testMatch: ['<rootDir>/src/**/*.test.ts?(x)'], // Keep explicit testMatch

  testEnvironment: 'node', // Keep node environment
  // preset: 'ts-jest', // next/jest handles the preset

  moduleNameMapper: {
    // Handle module aliases (adjust based on your tsconfig.json paths)
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"], // Keep ignore patterns
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
