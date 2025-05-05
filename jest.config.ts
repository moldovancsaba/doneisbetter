import type { Config } from 'jest';

// Base configuration shared between all test configurations
const baseConfig = {
  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  
  // Module name mapper for absolute imports
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // Handle CSS imports (with CSS modules)
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    // Handle CSS imports (without CSS modules)
    '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
    // Handle image imports
    '^.+\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  
  // Coverage directory is shared
  coverageDirectory: 'coverage',
};

// Create project configs for different test types
const config: Config = {
  // Global Jest configuration options
  verbose: true,
  testTimeout: 30000, // Set timeout globally
  collectCoverage: true, // Set coverage globally
  
  // Define multiple projects for different test environments
  projects: [
    // Database & Backend Tests (Node environment)
    {
      displayName: 'backend',
      testEnvironment: 'node',
      testMatch: [
        '<rootDir>/src/lib/**/__tests__/**/*.test.ts',
        '<rootDir>/src/lib/**/?(*.)+(spec|test).ts'
      ],
      transform: {
        '^.+\\.tsx?$': ['ts-jest', {
          tsconfig: 'tsconfig.json',
        }],
      },
      setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
      collectCoverageFrom: [
        'src/lib/**/*.{ts,tsx}',
        '!src/lib/**/*.d.ts',
        '!src/lib/**/__tests__/**',
        '!src/lib/**/__mocks__/**'
      ],
      ...baseConfig,
    },
    
    // React Component Tests (jsdom environment)
    {
      displayName: 'frontend',
      testEnvironment: 'jsdom',
      testMatch: [
        '<rootDir>/src/app/**/__tests__/**/*.test.{ts,tsx}',
        '<rootDir>/src/app/**/?(*.)+(spec|test).{ts,tsx}',
        '<rootDir>/src/components/**/__tests__/**/*.test.{ts,tsx}',
        '<rootDir>/src/components/**/?(*.)+(spec|test).{ts,tsx}'
      ],
      transform: {
        // Handle TypeScript files
        '^.+\\.(ts|tsx)$': ['ts-jest', {
          tsconfig: 'tsconfig.json',
          jsx: 'react-jsx',
        }],
        // Handle JavaScript files
        '^.+\\.(js|jsx)$': ['babel-jest', {
          presets: ['next/babel'],
        }],
      },
      setupFilesAfterEnv: [
        '<rootDir>/jest.react.setup.ts'
      ],
      collectCoverageFrom: [
        'src/app/**/*.{ts,tsx}',
        'src/components/**/*.{ts,tsx}',
        '!src/app/**/*.d.ts',
        '!src/app/**/__tests__/**',
        '!src/app/**/__mocks__/**',
        '!src/components/**/*.d.ts',
        '!src/components/**/__tests__/**',
        '!src/components/**/__mocks__/**'
      ],
      ...baseConfig,
    },
  ],
};

export default config;
