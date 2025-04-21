'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/app/page';

interface CardItemProps {
  card: Card;
  index: number;
}

export default function CardItem({ card, index }: CardItemProps) {
  if (!card || typeof card.createdAt === 'undefined') {
    return null;
  }

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: card.id,
    data: { index }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 1 : undefined,
    zIndex: isDragging ? 999 : undefined,
  };

  const createdAtString = String(card.createdAt);

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`card-item-draggable ${isDragging ? 'dragging' : ''}`}
      style={style}
      aria-roledescription="Draggable item"
      data-is-dragging={isDragging}
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
  );
}
