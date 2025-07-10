import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CardContainer } from './CardContainer';
import { CardImage } from './CardImage';
import type { Card as CardType } from '@/types/card';

interface CardProps {
  card: CardType;
  className?: string;
  onClick?: () => void;
}

/**
 * Card Component
 * 
 * Core card component that handles:
 * 1. Image aspect ratio preservation
 * 2. Optimal space utilization
 * 3. Responsive sizing
 * 4. Loading states
 * 5. Error handling
 * 
 * The component will always:
 * - Maintain the original image aspect ratio
 * - Fill the maximum available space without cropping
 * - Center content both vertically and horizontally
 * - Provide consistent behavior across all view modes
 */
export const Card: React.FC<CardProps> = ({
  card,
  className = '',
  onClick,
}) => {
  const [aspectRatio, setAspectRatio] = useState<number | undefined>();

  const handleImageLoad = (dimensions: { width: number; height: number }) => {
    setAspectRatio(dimensions.width / dimensions.height);
  };

  return (
    <CardContainer
      aspectRatio={aspectRatio}
      className={`overflow-hidden rounded-xl shadow-xl ${className}`}
      onClick={onClick}
    >
      <CardImage
        src={card.imageUrl}
        alt={card.title}
        onLoadComplete={handleImageLoad}
        className="transition-opacity duration-300"
      />
    </CardContainer>
  );
};
