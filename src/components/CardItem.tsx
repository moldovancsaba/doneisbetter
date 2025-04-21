'use client';

import { Draggable } from '@hello-pangea/dnd';
import { Card } from '@/app/page';

// Props interface
interface CardItemProps {
  card: Card;
  index: number;
}

export default function CardItem({ card, index }: CardItemProps) {
  // Ensure card and createdAt exist before rendering
  if (!card || typeof card.createdAt === 'undefined') {
    return null;
  }

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
          </div>
        </div>
      )}
    </Draggable>
  );
}

