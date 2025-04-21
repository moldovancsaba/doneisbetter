'use client';

import { Draggable } from '@hello-pangea/dnd';
import { Card } from '@/app/page';

interface CardItemProps {
  card: Card;
  index: number;
}

export default function CardItem({ card, index }: CardItemProps) {
  if (!card || typeof card.createdAt === 'undefined') {
    return null;
  }

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
            ...provided.draggableProps.style
          }}
          aria-roledescription="Draggable item"
          data-is-dragging={snapshot.isDragging}
        >
          <div 
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
