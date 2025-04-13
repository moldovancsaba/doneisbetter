'use client';

// Use the useSortable hook from dnd-kit
import { useSortable } from '@dnd-kit/sortable';
// Utility from dnd-kit to convert transform data to CSS string
import { CSS } from '@dnd-kit/utilities';

// REMOVED: react-swipeable imports and related state/logic (swipeState, isUpdating, error, handlers, getBackgroundColor)
// REMOVED: updateCardStatus import (now handled by KanbanBoard)
// REMOVED: onStatusUpdate prop

// MODIFIED: Use useSortable hook
export default function CardItem({ card }) {
  // Get properties and methods from useSortable
  const {
    attributes,      // Props to spread onto the draggable element (for accessibility, etc.)
    listeners,       // Event listeners (mousedown, touchstart) to initiate dragging
    setNodeRef,      // Ref function to assign to the draggable DOM node
    transform,       // Object containing x, y, scaleX, scaleY transform values during drag/drop animation
    transition,      // CSS transition string for smooth drop animation
    isDragging,      // Boolean indicating if this item is currently being dragged
  } = useSortable({ id: card.id }); // Provide the unique ID of the card

  // Generate the style object for positioning and animation
  const style = {
    // Use dnd-kit's CSS utility to generate the transform string
    transform: CSS.Transform.toString(transform),
    // Apply the transition string provided by dnd-kit
    transition,
    // Reduce opacity when dragging for visual feedback
    opacity: isDragging ? 0.5 : 1,
    // Change cursor to indicate draggability
    cursor: 'grab',
    // Prevent accidental text selection during drag
    userSelect: 'none',
    // Ensure the item is visually distinct while dragging (optional)
    zIndex: isDragging ? 10 : 'auto',
  };

  return (
    // Main draggable element container
    <div
      ref={setNodeRef} // Assign the ref for dnd-kit to track this element
      style={style} // Apply generated transform and transition styles
      {...attributes} // Spread required accessibility attributes
      {...listeners} // Spread event listeners to enable dragging
      // Apply dynamic classes for styling based on dragging state
      className={`card-item-draggable ${isDragging ? 'dragging' : ''}`}
    >
      {/* Keep the original visual representation of the card separate */}
      {/* This div does NOT get the transform/transition directly */}
      <div className="card">
        <p>{card.content}</p>
        <time className="card-time">
          {new Date(card.createdAt).toLocaleString()}
        </time>
         {/* Error display is removed as it's not handled here anymore */}
      </div>
    </div>
  );
}

