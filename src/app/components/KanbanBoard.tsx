'use client';

import { useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { Card, CardStatus, ColumnData, DragEndResult } from '../types/card';
import Column from './Column';
export interface KanbanBoardProps {
  /**
   * Array of cards to be distributed across columns
   */
  cards: Card[];
  
  /**
   * Whether the board is in a loading state
   */
  isLoading?: boolean;
  
  /**
   * Handler for when a card is clicked
   */
  onCardClick?: (card: Card) => void;
  
  /**
   * Handler for when a card's status or order is updated via drag and drop
   */
  onCardUpdate?: (updatedCard: Card) => void;
}

/**
 * The column configurations for the Kanban board
 */
const COLUMNS: ColumnData[] = [
  {
    id: 'todo-column',
    status: 'TODO',
    title: 'To Do',
    color: 'blue'
  },
  {
    id: 'in-progress-column',
    status: 'IN_PROGRESS',
    title: 'In Progress',
    color: 'amber'
  },
  {
    id: 'done-column',
    status: 'DONE',
    title: 'Done',
    color: 'green'
  }
];

/**
 * KanbanBoard component that organizes cards into status columns
 */
export default function KanbanBoard({
  cards,
  isLoading = false,
  onCardClick,
  onCardUpdate
}: KanbanBoardProps): JSX.Element {
  // State to track when a card is being dragged for visual feedback
  const [isDragging, setIsDragging] = useState(false);
  
  /**
   * Handles the end of a drag operation
   * @param result - The result of the drag operation
   */
  const handleDragEnd = (result: DragEndResult) => {
    setIsDragging(false);
    
    const { destination, source, draggableId } = result;
    
    // Dropped outside a valid droppable area
    if (!destination) {
      return;
    }
    
    // Dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    
    // Find the card that was dragged
    const card = cards.find(c => c.id === draggableId);
    if (!card) {
      return;
    }
    
    // Find destination column status based on droppableId
    const destinationColumn = COLUMNS.find(col => col.id === destination.droppableId);
    if (!destinationColumn) {
      return;
    }
    
    // Create updated card with new status and/or order
    const updatedCard: Card = {
      ...card,
      status: destinationColumn.status,
      order: destination.index
    };
    
    // Notify parent component of the update
    if (onCardUpdate) {
      onCardUpdate(updatedCard);
    }
  };
  
  return (
    <DragDropContext 
      onDragEnd={handleDragEnd}
      onDragStart={() => setIsDragging(true)}
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
              onCardClick={onCardClick}
            />
          ))}
        </div>
        
        {/* Screen reader announcement for drag operations */}
        <div className="sr-only" aria-live="polite">
          {isDragging ? 'Card is being dragged' : ''}
        </div>
      </div>
    </DragDropContext>
  );
}

