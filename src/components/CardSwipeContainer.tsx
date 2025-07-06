import React, { useCallback, useEffect, useState } from 'react';
import { motion, useAnimation, PanInfo } from 'framer-motion';

interface CardSwipeContainerProps {
  children: React.ReactNode;
  onVote: (direction: 'left' | 'right') => void;
  voteThreshold?: number;
  disabled?: boolean; // Add to prevent navigation during animations
}

/**
 * CardSwipeContainer Component
 * 
 * A simplified container component that handles both swipe gestures and keyboard
 * navigation for voting. Uses framer-motion for gesture handling.
 */
export const CardSwipeContainer: React.FC<CardSwipeContainerProps> = ({
  children,
  onVote,
  voteThreshold = 100,
  disabled = false,
}) => {
  const controls = useAnimation();
  const [keyPressed, setKeyPressed] = useState<'left' | 'right' | null>(null);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (disabled) return;
      if (e.key === 'ArrowLeft') {
        setKeyPressed('left');
        onVote('left');
      }
      if (e.key === 'ArrowRight') {
        setKeyPressed('right');
        onVote('right');
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onVote, disabled]);

  // Reset key pressed state
  useEffect(() => {
    if (keyPressed) {
      const timer = setTimeout(() => setKeyPressed(null), 200);
      return () => clearTimeout(timer);
    }
  }, [keyPressed]);

  // Handle drag end and voting
  const handleDragEnd = useCallback((_: any, info: PanInfo) => {
    const direction = info.offset.x > 0 ? 'right' : 'left';
    const exceedsThreshold = Math.abs(info.offset.x) > voteThreshold;

    if (exceedsThreshold) {
      onVote(direction);
      // Reset position after vote
      controls.set({ x: 0 });
    } else {
      // Return to center if threshold not met
      controls.start({
        x: 0,
        transition: { duration: 0.2 },
      });
    }
  }, [controls, onVote, voteThreshold]);

  return (
    <motion.div
      animate={controls}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      className="relative touch-none"
    >
      {children}
    </motion.div>
  );
};
