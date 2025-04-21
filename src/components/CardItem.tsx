'use client';

import { useState, MouseEvent } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { deleteCard } from '@/app/actions';
import { Card } from '@/app/page';

// Props interface
interface CardItemProps {
  card: Card;
  index: number;
}

export default function CardItem({ card, index }: CardItemProps) {
  // State with proper types
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Ensure card and createdAt exist before rendering
  if (!card || typeof card.createdAt === 'undefined') {
    return null;
  }
  
  // Handle delete button click
  const handleDelete = async (e: MouseEvent<HTMLButtonElement>): Promise<void> => {
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
          className={`card-item-draggable ${snapshot.isDragging ? 'dragging' : ''}`}
          style={{
            ...provided.draggableProps.style,
            position: 'relative',
            transform: snapshot.isDragging 
              ? provided.draggableProps.style?.transform 
              : undefined,
            zIndex: snapshot.isDragging ? 9999 : 'auto',
          }}
          aria-roledescription="Draggable item"
          data-is-dragging={snapshot.isDragging}
        >
          <div 
            {...provided.dragHandleProps}
            className="card"
            title="Drag to reorder"
            aria-label="Draggable card"
          >
            <p className="card-content">{card.content}</p>
            
            <time 
              dateTime={createdAtString} 
              className="card-time"
            >
              {createdAtString}
            </time>
            
            {/* Error message if deletion fails */}
            {deleteError && (
              <div 
                className="delete-error" 
                role="alert"
              >
                {deleteError}
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}

