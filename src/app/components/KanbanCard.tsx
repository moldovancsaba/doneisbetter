'use client';

import { useDrag } from 'react-dnd';
import { Card } from '../types/card';

interface KanbanCardProps {
  card: Card;
  isReadOnly: boolean;
  onClick?: (card: Card) => void;
  onDelete?: (cardId: string) => void;
}

export default function KanbanCard({
  card,
  isReadOnly,
  onClick,
  onDelete
}: KanbanCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CARD',
    item: { id: card.id },
    canDrag: !isReadOnly,
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    })
  }));

  const statusColor = {
    TODO: 'bg-blue-100 border-blue-300',
    IN_PROGRESS: 'bg-yellow-100 border-yellow-300',
    DONE: 'bg-green-100 border-green-300'
  }[card.status];

  return (
    <div
      ref={drag}
      className={`p-3 rounded-md border ${
        statusColor
      } cursor-grab shadow-sm ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
      onClick={() => onClick?.(card)}
    >
      <div className="flex justify-between items-start">
        <p className="text-gray-800">{card.content}</p>
        {onDelete && !isReadOnly && (
          <button
            onClick={e => {
              e.stopPropagation();
              onDelete(card.id);
            }}
            className="text-red-500 hover:text-red-700 ml-2"
            aria-label="Delete card"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

