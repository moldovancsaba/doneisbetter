'use client';

import { useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { Card, CardStatus, ColumnData, DragEndResult } from '../types/card';
import Column from './Column';

export interface KanbanBoardProps {
  cards: Card[];
  isLoading?: boolean;
  onCardClick?: (card: Card) => void;
  onCardUpdate?: (updatedCard: Card) => void;
  isReadOnly?: boolean;
}

const COLUMNS: ColumnData[] = [
  { id: 'todo-column', status: 'TODO', title: 'To Do', color: 'blue' },
  { id: 'in-progress-column', status: 'IN_PROGRESS', title: 'In Progress', color: 'amber' },
  { id: 'done-column', status: 'DONE', title: 'Done', color: 'green' }
];

export default function KanbanBoard({
  cards,
  isLoading = false,
  onCardClick,
  onCardUpdate,
  isReadOnly = false
}: KanbanBoardProps): JSX.Element {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnd = (result: DragEndResult) => {
    if (isReadOnly) return;
    setIsDragging(false);

    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const card = cards.find(c => c.id === draggableId);
    if (!card) return;
    const destinationColumn = COLUMNS.find(col => col.id === destination.droppableId);
    if (!destinationColumn) return;
    const updatedCard: Card = {
      ...card,
      status: destinationColumn.status,
      order: destination.index
    };
    if (onCardUpdate) onCardUpdate(updatedCard);
  };

  return (
    <DragDropContext
      onDragEnd={handleDragEnd}
      onDragStart={isReadOnly ? undefined : () => setIsDragging(true)}
    >
      <div
        className={`h-full ${isDragging ? 'cursor-grabbing' : ''}`}
        role="region"
        aria-label="Kanban board"
      >
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full"
          aria-orientation="horizontal"
        >
          {COLUMNS.map((column) => (
            <Column
              key={column.id}
              id={column.id}
              title={column.title}
              status={column.status}
              cards={cards}
              color={column.color}
              isLoading={isLoading}
              isReadOnly={isReadOnly}
              onCardClick={onCardClick}
            />
          ))}
        </div>
        <div className="sr-only" aria-live="polite">
          {isDragging ? 'Card is being dragged' : ''}
        </div>
      </div>
    </DragDropContext>
  );
}
