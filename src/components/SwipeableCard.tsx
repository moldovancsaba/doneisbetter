"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Heart, X } from 'lucide-react';
import { ICard } from '@/interfaces/Card';

export const SwipeableCard = ({ card, onSwipe, isAnimating, dragOffset }: { card: ICard, onSwipe: (cardId: string, direction: 'left' | 'right') => void, isAnimating: boolean, dragOffset: React.MutableRefObject<number> }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleStart = (clientX: number, clientY: number) => {
    if (isAnimating) return;
    setIsDragging(true);
    setStartPos({ x: clientX, y: clientY });
  };

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging || isAnimating) return;

    const diffX = clientX - startPos.x;
    const diffY = clientY - startPos.y;

    dragOffset.current = diffX;

    if (cardRef.current) {
      const rotation = Math.max(-30, Math.min(30, (diffX / 200) * 15));
      const opacity = Math.max(0.6, 1 - Math.abs(diffX) / 300);

      cardRef.current.style.transform = `translate(${diffX}px, ${diffY * 0.1}px) rotate(${rotation}deg)`;
      cardRef.current.style.opacity = opacity.toString();

      // Visual feedback for swipe direction
      const leftHint = cardRef.current.querySelector('.left-hint') as HTMLElement;
      const rightHint = cardRef.current.querySelector('.right-hint') as HTMLElement;

      if (diffX > 50) {
        rightHint.style.opacity = Math.min(1, diffX / 150).toString();
        leftHint.style.opacity = '0';
      } else if (diffX < -50) {
        leftHint.style.opacity = Math.min(1, Math.abs(diffX) / 150).toString();
        rightHint.style.opacity = '0';
      } else {
        leftHint.style.opacity = '0.2';
        rightHint.style.opacity = '0.2';
      }
    }
  }, [isDragging, isAnimating, startPos, dragOffset]);

  const handleEnd = useCallback((clientX: number, clientY: number) => {
    if (!isDragging || isAnimating) return;
    setIsDragging(false);

    const diffX = clientX - startPos.x;
    const diffY = clientY - startPos.y;
    const velocity = Math.abs(diffX) / 100;
    const threshold = Math.min(100, window.innerWidth * 0.25);

    // Check if swipe is strong enough (distance or velocity)
    if (Math.abs(diffX) > threshold || velocity > 2) {
      const direction = diffX > 0 ? 'right' : 'left';

      // Animate card off screen like Tinder
      if (cardRef.current) {
        const exitX = diffX > 0 ? window.innerWidth : -window.innerWidth;
        const exitY = diffY + (diffX * 0.2);

        cardRef.current.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
        cardRef.current.style.transform = `translate(${exitX}px, ${exitY}px) rotate(${diffX > 0 ? 30 : -30}deg)`;
        cardRef.current.style.opacity = '0';

        setTimeout(() => {
          onSwipe(card.uuid, direction);
        }, 300);
      }
    } else {
      // Spring back to center
      if (cardRef.current) {
        cardRef.current.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
        cardRef.current.style.transform = 'translate(0px, 0px) rotate(0deg)';
        cardRef.current.style.opacity = '1';

        // Reset hint opacity
        setTimeout(() => {
          if (cardRef.current) {
            cardRef.current.style.transition = '';
            const leftHint = cardRef.current.querySelector('.left-hint') as HTMLElement;
            const rightHint = cardRef.current.querySelector('.right-hint') as HTMLElement;
            if (leftHint) leftHint.style.opacity = '0.2';
            if (rightHint) rightHint.style.opacity = '0.2';
          }
        }, 300);
      }
    }

    dragOffset.current = 0;
  }, [isDragging, isAnimating, startPos, card, onSwipe, dragOffset]);

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      handleMove(e.clientX, e.clientY);
    }
  }, [isDragging, handleMove]);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      handleEnd(e.clientX, e.clientY);
    }
  }, [isDragging, handleEnd]);

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    }
  }, [handleMove]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    e.preventDefault();
    if (e.changedTouches.length === 1) {
      const touch = e.changedTouches[0];
      handleEnd(touch.clientX, touch.clientY);
    }
  }, [handleEnd]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd, { passive: false });

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return (
    <div
      ref={cardRef}
      className={`bg-white rounded-2xl shadow-2xl cursor-grab active:cursor-grabbing border border-gray-100 select-none ${
        isAnimating ? 'pointer-events-none' : ''
      }`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{
        touchAction: 'none',
        userSelect: 'none',
        aspectRatio: '3/4',
        width: '100%',
        position: 'relative',
        zIndex: 10
      }}
    >
      {/* Enhanced swipe hints */}
      <div className="left-hint absolute top-1/2 left-8 transform -translate-y-1/2 pointer-events-none transition-opacity duration-200" style={{ opacity: 0.2 }}>
        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
          <X className="w-8 h-8 text-white" />
        </div>
      </div>

      <div className="right-hint absolute top-1/2 right-8 transform -translate-y-1/2 pointer-events-none transition-opacity duration-200" style={{ opacity: 0.2 }}>
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
          <Heart className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Card Content */}
      <div className="h-full flex flex-col p-6">
        {/* Header section - Fixed height */}
        <div className="flex-shrink-0 h-20 flex items-center justify-center mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 text-center leading-tight line-clamp-2 select-none">
            {card.title}
          </h2>
        </div>

        {/* Main content section - Flexible but constrained */}
        <div className="flex-1 flex items-center justify-center min-h-0 mb-4">
          <p className="text-base md:text-lg text-gray-700 leading-relaxed text-center max-w-full overflow-hidden line-clamp-6 select-none px-2">
            {card.content.text}
          </p>
        </div>

        {/* Tags section - Fixed height */}
        <div className="flex-shrink-0 h-12 flex items-center justify-center">
          {card.tags && card.tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1 max-w-full overflow-hidden">
              {card.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200 font-medium select-none whitespace-nowrap"
                >
                  {tag.length > 10 ? `${tag.substring(0, 10)}...` : tag}
                </span>
              ))}
              {card.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full border border-gray-200 select-none">
                  +{card.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
