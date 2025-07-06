import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ImageCardProps {
  src: string;
  alt?: string;
  onError?: (error: Error) => void;
}

/**
 * ImageCard Component
 * 
 * A component for displaying images with loading and error states.
 * Uses framer-motion for smooth animations and transitions.
 */
export const ImageCard: React.FC<ImageCardProps> = ({
  src,
  alt = 'Image',
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoading(false);
    setHasError(true);
    if (onError) {
      onError(new Error(`Failed to load image: ${src}`));
    }
  };

  return (
    <div className="relative w-full h-full min-h-[300px] rounded-lg overflow-hidden bg-gray-100">
      {/* Loading Spinner */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </motion.div>
      )}

      {/* Error State */}
      {hasError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-red-50"
        >
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
          <p className="text-red-600 text-center">Failed to load image</p>
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
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className="absolute inset-0 w-full h-full object-contain"
        />
      </motion.div>
    </div>
  );
};
