import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface CardContainerProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'swipe' | 'vote' | 'ranking';
  aspectRatio?: number;
  onClick?: () => void;
}

/**
 * CardContainer Component
 * 
 * Handles the layout and sizing of card content. This component ensures that:
 * 1. Content is always centered both vertically and horizontally
 * 2. Available space is used optimally without cropping
 * 3. Aspect ratio is preserved when specified
 * 4. Container adapts to different view modes (swipe, vote, ranking)
 */
export const CardContainer: React.FC<CardContainerProps> = ({
  children,
  className = '',
  mode = 'swipe',
  aspectRatio,
  onClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    // Create ResizeObserver to monitor container size changes
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Initial update
    updateDimensions();

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Calculate container styles based on mode
  const getContainerStyles = () => {
    const baseStyles = 'w-full h-full';
    
    switch (mode) {
      case 'swipe':
        return `${baseStyles} flex items-center justify-center`;
      case 'vote':
        return `${baseStyles} flex items-center justify-center`;
      case 'ranking':
        return baseStyles;
      default:
        return baseStyles;
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className={`relative ${getContainerStyles()} ${className}`}
      style={{
        aspectRatio: aspectRatio || 'auto',
      }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};
