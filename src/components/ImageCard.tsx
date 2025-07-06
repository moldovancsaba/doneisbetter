import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ErrorBoundary } from './common/ErrorBoundary';

interface ImageCardProps {
  src: string;
  alt?: string;
  onError?: (error: Error) => void;
  fallbackDimensions?: { width: number; height: number };
}

/**
 * ImageCard Component
 * 
 * A component for displaying images with robust error handling and loading states.
 * Features automatic retries, fallback dimensions, and smooth animations.
 * 
 * Features:
 * - Automatic retry with exponential backoff
 * - Loading state with spinner
 * - Error state with visual feedback
 * - Fallback dimensions support
 * - Error boundary protection
 */
const ImageCardContent: React.FC<ImageCardProps> = ({
  src,
  alt = 'Image',
  onError,
  fallbackDimensions = { width: 300, height: 300 }
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [dimensions, setDimensions] = useState(fallbackDimensions);
  const maxRetries = 3;

  useEffect(() => {
    // Reset states when src changes
    setIsLoading(true);
    setHasError(false);
    setRetryCount(0);

    // Pre-load image to get dimensions
    const img = new Image();
    
    const handleLoad = () => {
      setDimensions({
        width: img.naturalWidth || fallbackDimensions.width,
        height: img.naturalHeight || fallbackDimensions.height
      });
      setIsLoading(false);
    };

    const handleError = () => {
      if (retryCount < maxRetries) {
        // Implement exponential backoff
        const timeout = Math.pow(2, retryCount) * 1000;
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          img.src = src; // Retry loading
        }, timeout);
      } else {
        setIsLoading(false);
        setHasError(true);
        if (onError) {
          onError(new Error(`Failed to load image after ${maxRetries} retries: ${src}`));
        }
      }
    };

    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);
    img.src = src;

    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };
  }, [src, retryCount, fallbackDimensions, onError]);

  const handleRetry = () => {
    setRetryCount(0);
    setIsLoading(true);
    setHasError(false);
  };

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden bg-gray-100"
         style={{
           minHeight: `${dimensions.height}px`,
           minWidth: `${dimensions.width}px`,
         }}
    >
      {/* Loading Spinner */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800"
        >
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          {retryCount > 0 && (
            <span className="absolute bottom-4 text-sm text-gray-500 dark:text-gray-400">
              Attempt {retryCount}/{maxRetries}
            </span>
          )}
        </motion.div>
      )}

      {/* Error State */}
      {hasError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-red-50 dark:bg-red-900"
        >
          <svg
            className="w-12 h-12 text-red-500 dark:text-red-400 mb-2"
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
          <p className="text-red-600 dark:text-red-400 text-center mb-2">
            Failed to load image after {maxRetries} attempts
          </p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 rounded-md transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      )}

      {/* Image */}
      <motion.div
        className="relative w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading || hasError ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        style={{ display: hasError ? 'none' : 'block' }}
      >
        <motion.img
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-contain"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{
            scale: isLoading ? 0.9 : 1,
            opacity: isLoading ? 0 : 1
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </div>
  );
};

/**
 * ImageCard Component with Error Boundary
 * 
 * Wraps the ImageCard content with an error boundary for additional protection
 * against rendering failures.
 */
export const ImageCard: React.FC<ImageCardProps> = (props) => {
  return (
    <ErrorBoundary>
      <ImageCardContent {...props} />
    </ErrorBoundary>
  );
};
