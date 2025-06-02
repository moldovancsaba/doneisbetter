import { useState, useCallback, useRef } from 'react';

/**
 * Custom hook to manage swipe operations and prevent double recording
 * 
 * @param {Function} onSwipeCallback - Function to call when a swipe is processed
 * @returns {Object} Swipe controller methods and state
 */
export const useSwipeController = (onSwipeCallback) => {
  // Track whether a swipe is in progress
  const [isSwipeLocked, setIsSwipeLocked] = useState(false);
  
  // Track cards that have been processed to prevent duplicates
  const processedCards = useRef(new Set());
  
  /**
   * Process a swipe action with locking to prevent duplicates
   * 
   * @param {String} direction - 'left' or 'right' swipe direction
   * @param {String} cardId - ID of the card being swiped
   * @returns {Boolean} - Whether the swipe was processed
   */
  const processSwipe = useCallback((direction, cardId) => {
    // Normalize direction for consistent processing
    const normalizedDirection = direction === "right" || direction === "like" 
      ? "right" 
      : "left";
    
    // Skip if swipe is locked or card was already processed
    if (isSwipeLocked || (cardId && processedCards.current.has(cardId))) {
      console.log(`Swipe ignored - locked: ${isSwipeLocked}, already processed: ${processedCards.current.has(cardId)}`);
      return false;
    }
    
    // Lock swipes to prevent concurrent processing
    setIsSwipeLocked(true);
    console.log(`Swipe lock activated for card ${cardId}`);
    
    // Mark this card as processed to prevent double swipes
    if (cardId) {
      processedCards.current.add(cardId);
      console.log(`Card ${cardId} marked as processed`);
    }
    
    // Execute the callback with normalized direction
    setTimeout(() => {
      onSwipeCallback?.(normalizedDirection, cardId);
      
      // Release lock after a delay
      setTimeout(() => {
        setIsSwipeLocked(false);
        console.log('Swipe lock released');
      }, 500);
    }, 100);
    
    return true;
  }, [isSwipeLocked, onSwipeCallback]);
  
  /**
   * Reset the swipe controller state
   */
  const resetSwipeController = useCallback(() => {
    // Clear the set of processed cards
    processedCards.current.clear();
    // Ensure lock is released
    setIsSwipeLocked(false);
    console.log('Swipe controller reset');
  }, []);
  
  return {
    isSwipeLocked,
    processSwipe,
    resetSwipeController,
    processedCardsCount: processedCards.current.size
  };
};

