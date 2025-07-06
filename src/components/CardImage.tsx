'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ErrorBoundary } from './common/ErrorBoundary';

interface CardImageProps {
  src: string;
  alt: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  quality?: number;
  priority?: boolean;
  onRetry?: () => void;
}

/**
 * CardImage Component
 * 
 * A reusable component for displaying images in cards with consistent styling and optimal loading.
 * Includes automatic retry logic, loading states, and graceful error handling.
 * 
 * Features:
 * - Automatic retry with exponential backoff
 * - Loading spinner during image load
 * - Error state with retry option
 * - Multiple size presets
 * - Error boundary protection
 */

const CardImageContent: React.FC<CardImageProps> = ({
  src,
  alt,
  className = '',
  size = 'md',
  quality = 75,
  priority = false,
  onRetry
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  // Responsive sizes based on the size prop
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  // Responsive image sizes based on the size prop
  const imageSizes = {
    sm: '64px',
    md: '96px',
    lg: '128px'
  };

  useEffect(() => {
    // Reset error state when src changes
    setIsError(false);
    setIsLoading(true);
    setRetryCount(0);
  }, [src]);

  const handleError = () => {
    if (retryCount < maxRetries) {
      // Implement exponential backoff for retries
      const timeout = Math.pow(2, retryCount) * 1000;
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setIsError(false); // Reset error state for retry
        setIsLoading(true); // Show loading state during retry
      }, timeout);
    } else {
      setIsLoading(false);
      setIsError(true);
      if (onRetry) {
        // Reset retry count when manual retry is attempted
        setRetryCount(0);
      }
    }
  };

  return (
    <div className={`relative rounded-lg overflow-hidden ${sizeClasses[size]} ${className}`} style={{ aspectRatio: '16/9' }}>
      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 p-2">
          <span className="text-sm text-gray-500 dark:text-gray-400 text-center mb-2">
            Failed to load image {retryCount > 0 ? `(Attempt ${retryCount}/${maxRetries})` : ''}
          </span>
          {(onRetry || retryCount < maxRetries) && (
            <button
              onClick={() => {
                setIsError(false);
                setIsLoading(true);
                if (retryCount >= maxRetries && onRetry) {
                  setRetryCount(0);
                  onRetry();
                }
              }}
              className="text-xs text-primary hover:text-primary-dark"
              disabled={isLoading}
            >
              {isLoading ? 'Retrying...' : 'Retry'}
            </button>
          )}
        </div>
      )}

      {/* Image */}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={imageSizes[size]}
        className={`object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        loading={priority ? 'eager' : 'lazy'}
        priority={priority}
        quality={quality}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRseHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/2wBDAR4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        onLoadingComplete={() => setIsLoading(false)}
        onError={handleError}
      />
    </div>
  );
};

/**
 * CardImage Component with Error Boundary
 * 
 * Wraps the CardImage content with an error boundary for additional protection
 * against rendering failures.
 */
export const CardImage: React.FC<CardImageProps> = (props) => {
  return (
    <ErrorBoundary>
      <CardImageContent {...props} />
    </ErrorBoundary>
  );
};
