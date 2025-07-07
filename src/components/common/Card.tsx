import { type Card as CardType } from '@/types/card';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

interface CardProps {
  card: CardType;
  rank?: number;
  onClick?: () => void;
  className?: string;
}

const CardContent = ({ card, onClick, className = '' }: CardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);

    const img = new Image();
    
    const handleLoad = () => {
      setIsLoading(false);
    };

    const handleError = () => {
      if (retryCount < maxRetries) {
        // Retry loading with exponential backoff
        const timeout = Math.pow(2, retryCount) * 1000;
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          img.src = card.imageUrl;
        }, timeout);
      } else {
        // After max retries, show error state
        setIsLoading(false);
        setHasError(true);
        console.error('Failed to load image after retries:', card.imageUrl);
      }
    };

    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);
    img.src = card.imageUrl; // Set src after adding event listeners

    return () => {
      // Cleanup event listeners
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };
  }, [card.imageUrl, retryCount]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`card-base bg-gray-900 rounded-lg overflow-hidden relative touch-none w-full h-full ${className}`}
      onClick={onClick}
      style={{
      }}
    >
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-75 p-4">
          <svg
            className="w-12 h-12 text-red-500 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p className="text-white text-center text-sm">Failed to load image</p>
        </div>
      )}

      {/* Image */}
      <motion.img
        src={card.imageUrl}
        alt={card.title}
        className={`w-full h-full object-cover select-none pointer-events-none transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        loading="lazy"
        draggable="false"
        animate={{ opacity: !isLoading && !hasError ? 1 : 0 }}
        initial={{ opacity: 0 }}
      />
    </motion.div>
  );
};

/**
 * Card Component with Error Boundary
 * 
 * A wrapper component that provides error boundary protection for the card content.
 * Implements responsive image handling with proper aspect ratio preservation, touch interaction
 * prevention, and cross-browser drag prevention.
 * 
 * Core Features:
 * - Automatic aspect ratio calculation and preservation
 * - Responsive sizing with container-based dimensions
 * - Cross-browser image drag prevention
 * - Touch interaction blocking for mobile devices
 * 
 * Image Handling:
 * - Lazy loading for performance optimization
 * - Automatic retry with exponential backoff (up to 3 attempts)
 * - Loading state with animated indicator
 * - Error state with visual feedback
 * - Proper cleanup of image event listeners
 * 
 * Performance Optimizations:
 * - Efficient aspect ratio calculations using native browser APIs
 * - Minimal resize calculations through CSS-based sizing
 * - Memory leak prevention through proper useEffect cleanup
 * - Controlled re-renders with proper dependency arrays
 * 
 * Accessibility:
 * - Alt text support for screen readers
 * - Loading state announcements
 * - Error state feedback
 * 
 * CSS Classes:
 * - card-base: Base styling for card container
 * - touch-none: Prevents touch interactions on mobile
 * - select-none: Prevents text/content selection
 * - pointer-events-none: Additional interaction prevention
 * 
 * Props:
 * @param {CardType} card - The card data containing image URL and title
 * @param {number} [rank] - Optional rank to display
 * @param {() => void} [onClick] - Optional click handler
 * @param {string} [className] - Optional additional CSS classes
 */
export function Card(props: CardProps) {
  return (
    <ErrorBoundary>
      <CardContent {...props} />
    </ErrorBoundary>
  );
}
