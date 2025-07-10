import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface CardImageProps {
  src: string;
  alt: string;
  onLoadComplete?: (dimensions: { width: number; height: number }) => void;
  className?: string;
}

/**
 * CardImage Component
 * 
 * Handles image loading, aspect ratio preservation, and provides loading states.
 * This component ensures that images are never cropped and maintain their original
 * aspect ratio while filling the available space optimally.
 */
export const CardImage: React.FC<CardImageProps> = ({
  src,
  alt,
  onLoadComplete,
  className = '',
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const img = new Image();
    
    const handleLoad = () => {
      const newDimensions = {
        width: img.naturalWidth,
        height: img.naturalHeight
      };
      setDimensions(newDimensions);
      setIsLoading(false);
      onLoadComplete?.(newDimensions);
    };

    const handleError = () => {
      setHasError(true);
      setIsLoading(false);
    };

    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);
    img.src = src;

    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };
  }, [src, onLoadComplete]);

  return (
    <div className="relative w-full h-full">
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
        src={src}
        alt={alt}
className={`w-full h-full select-none pointer-events-none user-select-none webkit-user-drag-none ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${className}`}
        style={{
          objectFit: 'contain',
          aspectRatio: dimensions.width / dimensions.height || undefined,
        }}
        draggable={false}
        animate={{ opacity: !isLoading && !hasError ? 1 : 0 }}
        initial={{ opacity: 0 }}
      />
    </div>
  );
};
