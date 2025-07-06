/**
 * Shared layout constants and configurations for responsive design
 * This file contains breakpoints, grid spacing, and reusable grid configurations
 * to maintain consistent layouts across components
 */

// Breakpoint values in pixels for responsive design
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

// Grid spacing values in pixels for different viewport sizes
export const GRID_SPACING = {
  sm: 16,
  md: 24,
  lg: 32,
};

// Reusable grid configurations for consistent layouts
export const GRID_CONFIG = {
  // Default container max widths aligned with breakpoints
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // Common grid column configurations
  columns: {
    sm: 4,    // 4 columns for small screens
    md: 6,    // 6 columns for medium screens
    lg: 12,   // 12 columns for large screens
  },
  
  // Grid gap (gutters) configuration
  gaps: {
    x: {      // Horizontal gaps
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
    },
    y: {      // Vertical gaps
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
    },
  },
  
  // Padding for grid containers
  padding: {
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
  },
};

// Helper type for breakpoint keys
export type BreakpointKey = keyof typeof BREAKPOINTS;

// Helper type for grid spacing keys
export type GridSpacingKey = keyof typeof GRID_SPACING;

// Helper function to get media query string for a breakpoint
export const getMediaQuery = (breakpoint: BreakpointKey): string => {
  return `@media (min-width: ${BREAKPOINTS[breakpoint]}px)`;
};

export type Orientation = 'portrait' | 'landscape';

export const getOrientation = (width: number, height: number): Orientation => {
  return width >= height ? 'landscape' : 'portrait';
};

export const calculateImageDimensions = (
  containerWidth: number,
  containerHeight: number,
  imageWidth: number,
  imageHeight: number
) => {
  const containerAspectRatio = containerWidth / containerHeight;
  const imageAspectRatio = imageWidth / imageHeight;

  let width: number;
  let height: number;

  if (imageAspectRatio > containerAspectRatio) {
    // Image is wider than container relative to height
    width = containerWidth;
    height = containerWidth / imageAspectRatio;
  } else {
    // Image is taller than container relative to width
    height = containerHeight;
    width = containerHeight * imageAspectRatio;
  }

  return { width, height };
};

export const useWindowOrientation = (): Orientation => {
  if (typeof window === 'undefined') return 'portrait';
  return getOrientation(window.innerWidth, window.innerHeight);
};
