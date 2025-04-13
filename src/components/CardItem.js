'use client';

import { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { updateCardStatus } from '@/app/actions'; // Adjust path if necessary

// Configuration constants for swipe behavior
const SWIPE_THRESHOLD = 50; // Minimum horizontal distance in pixels to trigger an action
const MAX_OPACITY = 0.7;    // Maximum background opacity during swipe visual feedback

// MODIFIED: Rename prop from onSwipeComplete to onStatusUpdate
export default function CardItem({ card, onStatusUpdate }) {
  const [swipeState, setSwipeState] = useState({ x: 0, dir: null, opacity: 0 });
  // State to track if the update server action is in progress
  const [isUpdating, setIsUpdating] = useState(false);
  // State to hold potential errors from the server action
  const [error, setError] = useState(null);

  // Function to call the server action when a swipe threshold is met
  const handleSwipeAction = async (dir) => {
    // Prevent triggering multiple updates if one is already in progress
    if (isUpdating) return;
    setIsUpdating(true);
    setError(null); // Clear previous errors

    // Determine the new status based on swipe direction
    const newStatus = dir === 'Left' ? 'deleted' : 'done';
    console.log(`Swiped ${dir}, attempting to set status to ${newStatus} for card ${card.id}`);

    try {
      // Call the server action
      const result = await updateCardStatus(card.id, newStatus);
      // If the server action confirms success
      if (result.success) {
        console.log(`Successfully updated card ${card.id} to ${newStatus}`);
        // MODIFIED: Call onStatusUpdate with cardId and the new status
        onStatusUpdate(card.id, newStatus);
        // If the action was successful, the KanbanBoard will handle removing/moving the item.
        // No need to reset state here as the component might unmount or be moved.
      } else {
        console.error(`Failed to update card ${card.id}:`, result.error);
        setError(result.error || 'Failed to update status.'); // Show error message
        setSwipeState({ x: 0, dir: null, opacity: 0 }); // Reset visual swipe state on error
        setIsUpdating(false); // Allow trying again
      }
    } catch (err) { // Catch network or unexpected errors
      console.error(`Network/unexpected error updating card ${card.id}:`, err);
      setError('A network error occurred. Please try again.');
      setSwipeState({ x: 0, dir: null, opacity: 0 }); // Reset visual swipe state
      setIsUpdating(false); // Allow trying again
    }
     // Note: `finally` block removed as resetting `isUpdating` on success isn't needed if component unmounts
  };

  // Configure the swipe handlers using react-swipeable
  const handlers = useSwipeable({
    // Called continuously during swiping
    onSwiping: (eventData) => {
      if (isUpdating) return; // Don't allow visual swipe change if updating
      // Calculate opacity based on swipe distance relative to threshold
      const opacity = Math.min(Math.abs(eventData.deltaX) / (SWIPE_THRESHOLD * 1.5), MAX_OPACITY);
       // Update visual state: x translation, swipe direction, background opacity
       setSwipeState({
          x: eventData.deltaX,
          dir: eventData.dir,
          opacity: opacity
       });
    },
    // Called once when the swipe gesture ends
    onSwiped: (eventData) => {
      // Reset visual state immediately for a snap-back effect before action processing
      setSwipeState({ x: 0, dir: null, opacity: 0 });

      // Check if the swipe distance met the threshold required for an action
      if (Math.abs(eventData.deltaX) > SWIPE_THRESHOLD) {
          // Check if the swipe was primarily horizontal (Left or Right)
          if (eventData.dir === 'Left' || eventData.dir === 'Right') {
              // Trigger the server action based on the direction
              handleSwipeAction(eventData.dir);
          }
      }
    },
    trackMouse: true,           // Enable swipe detection for mouse events on desktop
    preventScrollOnSwipe: true, // Prevent page scrolling vertically when swiping horizontally
  });

  // Function to determine the background color effect during swipe
   const getBackgroundColor = () => {
       // No background effect if not swiping or no direction detected
       if (!swipeState.dir || swipeState.x === 0 || isUpdating) return 'transparent';
       const opacity = swipeState.opacity || 0; // Use calculated opacity
       if (swipeState.dir === 'Left') { // Swipe Left (Delete) -> Red background
           return `rgba(239, 68, 68, ${opacity})`; // Red-500 with dynamic opacity
       } else if (swipeState.dir === 'Right') { // Swipe Right (Done) -> Green background
           return `rgba(34, 197, 94, ${opacity})`; // Green-500 with dynamic opacity
       }
       return 'transparent'; // Default transparent
   };

  return (
    // Wrapper div captures swipe events and shows background feedback
    <div
      {...handlers} // Spread the swipe handlers onto this div
      className={`card-item-wrapper ${isUpdating ? 'updating' : ''}`}
      style={{
         backgroundColor: getBackgroundColor(),
         touchAction: 'pan-y' // Crucial: Allow vertical scrolling on touch devices
       }}
    >
      {/* The actual card content div that gets visually transformed */}
      <div
        className="card" // Uses existing card styles
        style={{
          // Apply horizontal translation based on swipe distance
          // Apply transition for smooth snap-back effect when swipe ends or resets
          transform: `translateX(${swipeState.x}px)`,
          transition: swipeState.x === 0 ? 'transform 0.2s ease-out' : 'none' // Only transition on reset
        }}
      >
        <p>{card.content}</p>
        <time className="card-time">
          {/* Safely format the date string */}
          {new Date(card.createdAt).toLocaleString()}
        </time>
         {/* Display error message if swipe action failed */}
         {error && <p className="error-message" style={{ marginTop: '0.5rem' }}>{error}</p>}
      </div>
    </div>
  );
}

