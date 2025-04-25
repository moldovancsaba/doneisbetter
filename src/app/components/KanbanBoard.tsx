'use client';



import { useCallback, useMemo } from 'react';
import { DndProvider, useDrop } from 'react-dnd';
import { Card, CardStatus, CardStatusValues } from '../types/card';
import { HTML5Backend } from 'react-dnd-html5-backend';
import KanbanCard from './KanbanCard';
interface KanbanBoardProps {
  cards: Card[];
  isLoading: boolean;
  isReadOnly: boolean;
  onCardClick?: (card: Card) => void;
  onCardUpdate?: (card: Card) => void;
  onCardDelete?: (cardId: string) => void;
}

const statuses: CardStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];

export default function KanbanBoard({
  cards,
  isLoading,
  isReadOnly,
  onCardClick,
  onCardUpdate,
  onCardDelete
}: KanbanBoardProps) {
  const handleDrop = useCallback(
    (cardId: string, newStatus: CardStatus) => {
      const card = cards.find(c => c.id === cardId);
      if (card && card.status !== newStatus && onCardUpdate) {
        onCardUpdate({ ...card, status: newStatus });
      }
    },
    [cards, onCardUpdate]
  );

  const cardsByStatus = useMemo(() => {
    // Initialize all status groups
    const grouped: Record<CardStatus, Card[]> = {
      TODO: [],
      IN_PROGRESS: [],
      DONE: []
    };

    // Process each card with validation
    cards.forEach(card => {
      // Ensure the status is valid, default to TODO if not
      const status = Object.keys(CardStatusValues).includes(card.status)
        ? card.status
        : 'TODO';
      grouped[status as CardStatus].push(card);
    });

    return grouped;
  }, [cards]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
        {statuses.map(status => (
          <StatusColumn
            key={status}
            status={status}
            cards={cardsByStatus[status]}
            isLoading={isLoading}
            isReadOnly={isReadOnly}
            onDrop={handleDrop}
            onCardClick={onCardClick}
            onCardDelete={onCardDelete}
          />
        ))}
      </div>
    </DndProvider>
  );
}

interface StatusColumnProps {
  status: CardStatus;
  cards: Card[];
  isLoading: boolean;
  isReadOnly: boolean;
  onDrop: (cardId: string, status: CardStatus) => void;
  onCardClick?: (card: Card) => void;
  onCardDelete?: (cardId: string) => void;
}

function StatusColumn({
  status,
  cards,
  isLoading,
  isReadOnly,
  onDrop,
  onCardClick,
  onCardDelete
}: StatusColumnProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'CARD',
    drop: (item: { id: string }) => onDrop(item.id, status),
    collect: monitor => ({
      isOver: !!monitor.isOver()
    })
  }));

  const statusTitle = {
    TODO: 'To Do',
    IN_PROGRESS: 'In Progress',
    DONE: 'Done'
  }[status];

  return (
    <div
      ref={drop}
      className={`p-4 rounded-lg h-full ${
        isOver ? 'bg-blue-50' : 'bg-gray-50'
      } border border-gray-200`}
    >
      <h2 className="text-lg font-semibold mb-4 text-center">
        {statusTitle} ({cards.length})
      </h2>
      
      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          cards.map(card => (
            <KanbanCard
              key={card.id}
              card={card}
              isReadOnly={isReadOnly}
              onClick={onCardClick}
              onDelete={onCardDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}

