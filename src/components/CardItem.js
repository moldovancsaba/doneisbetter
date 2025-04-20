'use client';
// Make sure this is the only import from this library
import { Draggable } from '@hello-pangea/dnd';
import { deleteCard } from '@/app/actions';
import { useState } from 'react';
export default function CardItem({ card, index }) {
  // State for delete operation
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // Ensure card and card.createdAt exist before rendering
  if (!card || typeof card.createdAt === 'undefined') {
    console.warn("CardItem received invalid card data:", card);
    return null; // Don't render if data is invalid
  }
  
  // Handler for delete button click
  const handleDelete = async (e) => {
    // Stop event propagation to prevent drag behavior
    e.stopPropagation();
    
    // Ask for confirmation
    if (!window.confirm('Are you sure you want to permanently delete this card?')) {
      return;
    }
    
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      const result = await deleteCard(card.id);
      
      if (!result.success) {
        setDeleteError(result.error || 'Failed to delete the card.');
        console.error('Delete error:', result.error);
      }
    } catch (error) {
      setDeleteError('An unexpected error occurred.');
      console.error('Delete exception:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Explicitly ensure we are working with the string format
  const createdAtString = String(card.createdAt);

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`card-item-draggable ${snapshot.isDragging ? 'dragging' : ''}`}
          style={{
            ...provided.draggableProps.style,
            position: 'relative', // Enable absolute positioning of the delete button
            userSelect: 'none',
          }}
        >
          <div className="card">
            <p>{card.content}</p>
            {/* RE-CONFIRMED: Display the ISO string directly */}
            <time dateTime={createdAtString} className="card-time">
              {createdAtString}
            </time>
            
            {/* Delete button */}
            <button 
              onClick={handleDelete}
              disabled={isDeleting}
              className="delete-button"
              aria-label="Delete card"
              title="Delete card permanently"
            >
              {isDeleting ? '⏳' : '🗑️'}
            </button>
            
            {/* Error message if deletion fails */}
            {deleteError && (
              <div className="delete-error">{deleteError}</div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  ); // End of return statement
} // End of CardItem component function
