import { motion, useAnimation, PanInfo } from 'framer-motion';
import { useState } from 'react';

// Core animation values
const swipeConfidenceThreshold = 10000;
const swipeDirection = {
  LEFT: 'left',
  RIGHT: 'right'
};

// Direction detection
const getDirection = (offset: number) => offset < 0 ? swipeDirection.LEFT : swipeDirection.RIGHT;

// Animation configuration
const dragConstraints = { left: -1000, right: 1000 };
const exitVariants = {
  [swipeDirection.LEFT]: {
    x: -1000,
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeOut' }
  },
  [swipeDirection.RIGHT]: {
    x: 1000,
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeOut' }
  }
};

interface SwipeCardProps {
  children: React.ReactNode;
  onVote: (direction: string) => void;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({ children, onVote }) => {
  const controls = useAnimation();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    const direction = getDirection(offset);
    
    // Calculate swipe confidence based on velocity and offset
    const swipeConfidence = Math.abs(velocity * offset);
    
    if (swipeConfidence > swipeConfidenceThreshold) {
      // Trigger exit animation based on swipe direction
      controls.start(exitVariants[direction]).then(() => {
        onVote(direction);
      });
    } else {
      // Return to center if swipe wasn't confident enough
      controls.start({
        x: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 300, damping: 20 }
      });
    }
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={dragConstraints}
      dragElastic={1}
      animate={controls}
      initial={{ x: 0, opacity: 1 }}
      whileDrag={{
        scale: 1.05,
        cursor: 'grabbing'
      }}
      style={{
        position: 'relative',
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {children}
    </motion.div>
  );
};
