/**
 * Jest setup file for React component testing
 */
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Configure Testing Library
configure({
  // Default timeout for async utilities (ms)
  asyncUtilTimeout: 5000,
  // Default wait time (ms)
  defaultHidden: true,
  // suppressErrorOutput is not a valid option in this version of Testing Library
});

// Mock global browser APIs used in components
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock for window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock for window.scrollTo
window.scrollTo = jest.fn();

// Mock for IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
}));

// Mock for fetch
global.fetch = jest.fn();

// Suppress React 18 console errors related to act()
const originalError = console.error;
console.error = (...args) => {
  if (/Warning: ReactDOM.render is no longer supported/.test(args[0])) {
    return;
  }
  if (/Warning: An update to .* inside a test was not wrapped in act/.test(args[0])) {
    return;
  }
  originalError(...args);
};

// Add any additional environment setup for React tests here

