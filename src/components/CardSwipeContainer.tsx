import React, { useCallback, useEffect, useState } from 'react';
import { motion, useAnimation, PanInfo } from 'framer-motion';

interface CardSwipeContainerProps {
  children: React.ReactNode;
  onVote: (direction: 'left' | 'right') => void;
  voteThreshold?: number;
  disabled?: boolean;
  mode: 'swipe' | 'vote';
  // Optional override for optimal dimensions
  maxWidth?: string | number;
  maxHeight?: string | number;
  // Allow custom constraint ratios
  widthRatio?: number;
  heightRatio?: number;
}

/**
 * CardSwipeContainer Component
 * 
 * A simplified container component that handles both swipe gestures and keyboard
 * navigation for voting. Uses framer-motion for gesture handling.
 */
// Get optimal dimensions based on viewport size and mode
const getOptimalDimensions = (mode: 'swipe' | 'vote') => {
  const vh = window.innerHeight;
  return {
    height: Math.min(vh * 0.8, 700), // reduce height by 10%
  };
};

export const CardSwipeContainer: React.FC<CardSwipeContainerProps> = ({
  children,
  onVote,
  voteThreshold = 100,
  disabled = false,
  mode,
  maxWidth,
  maxHeight,
  widthRatio = 0.9,
  heightRatio = 0.8,
}) => {
const controls = useAnimation();
  const [dragDirection, setDragDirection] = useState<'left' | 'right' | null>(null);
  const [dimensions, setDimensions] = useState(getOptimalDimensions(mode));

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions(getOptimalDimensions(mode));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (disabled) return;
      
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const direction = e.key === 'ArrowLeft' ? 'left' : 'right';
        const xOffset = direction === 'left' ? -voteThreshold * 1.5 : voteThreshold * 1.5;
        
        if (mode === 'swipe') {
          // For swipe mode, animate and trigger vote
          controls.start({ 
            x: xOffset, 
            opacity: 0.5,
            rotate: direction === 'left' ? -30 : 30
          }).then(() => {
            onVote(direction);
            setTimeout(() => controls.set({ x: 0, opacity: 1, rotate: 0 }), 0);
          });
        } else {
          // For vote mode, just trigger vote immediately
          onVote(direction);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onVote, disabled, controls, voteThreshold, mode]);

  // Enhanced drag handling with improved visual feedback
  const handleDrag = (_: any, info: PanInfo) => {
    if (disabled) return;

    const direction = info.offset.x > 0 ? 'right' : 'left';
    setDragDirection(direction);
    
    // Enhanced rotation and scaling effects
    const rotate = info.offset.x * 0.08; // Reduced rotation for smoother feel
    const scale = 1 - Math.abs(info.offset.x) / (voteThreshold * 8); // Subtle scale effect
    const opacity = 1 - Math.abs(info.offset.x) / (voteThreshold * 2.5); // Smoother opacity transition

    controls.start({
      rotate,
      scale: Math.max(scale, 0.95), // Prevent scale from going too small
      opacity: Math.max(opacity, 0.6), // Prevent opacity from going too low
      transition: { type: 'spring', stiffness: 1000, damping: 50 } // Spring animation for smoother feel
    });
  };

  // Enhanced drag end handling with improved animations
  const handleDragEnd = useCallback((_: any, info: PanInfo) => {
    if (disabled) return;

    const direction = info.offset.x > 0 ? 'right' : 'left';
    const exceedsThreshold = Math.abs(info.offset.x) > voteThreshold;

    if (exceedsThreshold) {
      // Enhanced exit animation
      controls.start({
        x: direction === 'left' ? -window.innerWidth * 1.5 : window.innerWidth * 1.5,
        opacity: 0,
        scale: 0.8,
        transition: { 
          type: 'spring',
          stiffness: 400,
          damping: 40,
          duration: 0.3
        }
      }).then(() => {
        onVote(direction);
        setTimeout(() => controls.set({ x: 0, rotate: 0, opacity: 1, scale: 1 }), 0);
      });
    } else {
      // Enhanced return animation
      controls.start({
        x: 0,
        rotate: 0,
        opacity: 1,
        scale: 1,
        transition: { 
          type: 'spring',
          stiffness: 500,
          damping: 25,
          duration: 0.2
        },
      });
    }
    setDragDirection(null);
  }, [controls, onVote, voteThreshold, disabled]);

  return (
    <motion.div
      animate={controls}
      drag={!disabled && mode === 'swipe' ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9} // Increased elasticity for better touch feel
      dragTransition={{ 
        bounceStiffness: 600,
        bounceDamping: 20
      }}
      onDrag={mode === 'swipe' ? handleDrag : undefined}
      onDragEnd={mode === 'swipe' ? handleDragEnd : undefined}
      className={`
        relative w-full h-full touch-none select-none
        ${mode === 'swipe' ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      whileHover={!disabled && mode === 'vote' ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? (mode === 'swipe' ? { cursor: 'grabbing' } : { scale: 0.98 }) : undefined}
      style={{
        x: 0,
        opacity: 1,
        rotate: 0,
        touchAction: 'none',
        WebkitTapHighlightColor: 'transparent', // Remove tap highlight on mobile
        WebkitTouchCallout: 'none', // Disable touch callout
        WebkitUserSelect: 'none', // Prevent text selection
        userSelect: 'none',
        msUserSelect: 'none',
        MozUserSelect: 'none',
        pointerEvents: disabled ? 'none' : 'auto'
      }}
      onClick={!disabled && mode === 'vote' ? () => onVote('right') : undefined}
    >
      {children}
    </motion.div>
  );
};
