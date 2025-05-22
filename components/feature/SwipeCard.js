import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Card } from '../base/Card';

export const SwipeCard = ({
  children,
  onSwipe,
  threshold = 100,
  className = '',
  ...props
}) => {
  const [swiping, setSwiping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);
  
  // Refs for tracking touch/mouse movement
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const cardRef = useRef(null);
  const animationRef = useRef(null);
  
  // Constants
  const ROTATION_FACTOR = 0.15; // Rotation degree per pixel moved
  const SWIPE_ANGLE_THRESHOLD = 30; // Maximum angle for a horizontal swipe
  
  const handleGestureStart = (clientX, clientY) => {
    touchStartX.current = clientX;
    touchStartY.current = clientY;
    currentX.current = 0;
    currentY.current = 0;
    setSwiping(true);
    
    // Start animation frame loop
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    animate();
  };
  
  const handleGestureMove = (clientX, clientY) => {
    if (touchStartX.current === null) return;
    
    const deltaX = clientX - touchStartX.current;
    const deltaY = clientY - touchStartY.current;
    
    // Check if the gesture is more horizontal than vertical
    const angle = Math.abs(Math.atan2(deltaY, deltaX) * 180 / Math.PI);
    if (angle < SWIPE_ANGLE_THRESHOLD || angle > (180 - SWIPE_ANGLE_THRESHOLD)) {
      currentX.current = deltaX;
      currentY.current = deltaY;
    }
  };
  
  const handleGestureEnd = () => {
    if (touchStartX.current === null) return;
    
    const deltaX = currentX.current;
    const direction = deltaX > 0 ? 'right' : 'left';
    
    if (Math.abs(deltaX) > threshold) {
      completeSwipe(direction);
    } else {
      resetCardPosition();
    }
    
    touchStartX.current = null;
    touchStartY.current = null;
    setSwiping(false);
  };
  
  const animate = () => {
    if (!cardRef.current) return;
    
    const rotate = currentX.current * ROTATION_FACTOR;
    const translateX = currentX.current;
    const scale = Math.max(1 - Math.abs(currentX.current) / 1000, 0.95);
    
    cardRef.current.style.transform = 
      `translate(${translateX}px) rotate(${rotate}deg) scale(${scale})`;
    
    // Update swipe direction indicator
    if (Math.abs(currentX.current) > threshold / 2) {
      setSwipeDirection(currentX.current > 0 ? 'right' : 'left');
    } else {
      setSwipeDirection(null);
    }
    
    animationRef.current = requestAnimationFrame(animate);
  };
  
  const completeSwipe = (direction) => {
    if (!cardRef.current) return;
    
    const endX = direction === 'right' ? window.innerWidth + 200 : -window.innerWidth - 200;
    cardRef.current.style.transition = 'transform 0.3s ease-out';
    cardRef.current.style.transform = `translate(${endX}px) rotate(${direction === 'right' ? 30 : -30}deg)`;
    
    setSwipeDirection(direction);
    
    // Call the onSwipe callback
    if (onSwipe) {
      onSwipe(direction);
    }
    
    // Reset card position after animation completes
    setTimeout(() => {
      resetCardPosition();
    }, 300);
  };
  
  const resetCardPosition = () => {
    if (!cardRef.current) return;
    
    cardRef.current.style.transition = 'transform 0.3s ease-out';
    cardRef.current.style.transform = 'none';
    setSwipeDirection(null);
    
    setTimeout(() => {
      if (cardRef.current) {
        cardRef.current.style.transition = 'none';
      }
    }, 300);
  };
  
  // Event handlers for both touch and mouse events
  const onTouchStart = (e) => handleGestureStart(e.touches[0].clientX, e.touches[0].clientY);
  const onTouchMove = (e) => handleGestureMove(e.touches[0].clientX, e.touches[0].clientY);
  const onTouchEnd = () => handleGestureEnd();
  
  const onMouseDown = (e) => handleGestureStart(e.clientX, e.clientY);
  const onMouseMove = (e) => handleGestureMove(e.clientX, e.clientY);
  const onMouseUp = () => handleGestureEnd();
  const onMouseLeave = () => handleGestureEnd();
  
  return (
    <div className="relative w-full max-w-md">
      {/* Swipe indicators */}
      <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-200 ${swipeDirection === 'left' ? 'opacity-100' : 'opacity-0'}`}>
        <div className="bg-red-500/80 text-white px-6 py-2 rounded-lg transform -rotate-12 text-xl font-bold">
          NOPE
        </div>
      </div>
      <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-200 ${swipeDirection === 'right' ? 'opacity-100' : 'opacity-0'}`}>
        <div className="bg-green-500/80 text-white px-6 py-2 rounded-lg transform rotate-12 text-xl font-bold">
          LIKE
        </div>
      </div>
      
      {/* Swipeable card */}
      <Card
        ref={cardRef}
        interactive
        className={`touch-none cursor-grab active:cursor-grabbing transition-all duration-200 ${className}`}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={swiping ? onMouseMove : undefined}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        {...props}
      >
        {children}
      </Card>
    </div>
  );
};

SwipeCard.propTypes = {
  children: PropTypes.node.isRequired,
  onSwipe: PropTypes.func,
  threshold: PropTypes.number,
  className: PropTypes.string,
};

