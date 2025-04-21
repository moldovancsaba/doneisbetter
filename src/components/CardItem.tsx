import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '../app/page';

interface CardItemProps {
  card: Card;
  index: number;
  isOverlay?: boolean;
}

export default function CardItem({ card, index, isOverlay }: CardItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: card.id,
    data: card,
    disabled: isOverlay,
  });

  const style = {
    position: 'absolute' as const,
    left: card.position.x,
    top: card.position.y,
    ...(transform && !isOverlay
      ? {
          transform: CSS.Translate.toString(transform),
          zIndex: isDragging ? 999 : 1,
          opacity: isDragging ? 0.5 : 1,
        }
      : {}),
    ...(isOverlay ? { position: 'fixed' as const } : {}),
  };

  const createdAtString = String(card.createdAt);

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`card-item-draggable${isDragging ? ' dragging' : ''}`}
      style={style}
    >
      <div className="card">
        <p className="card-content">{card.content}</p>
        <time className="card-time">{createdAtString}</time>
      </div>
    </div>
  );
}
