'use client';

import { useState } from 'react'; // Re-add useState
import { DragDropContext, DropResult } from '@hello-pangea/dnd'; // Change DragEndResult to DropResult
import { Card, CardStatus, ColumnData } from '../types/card'; // Keep types
import Column from './Column';

export interface KanbanBoardProps {
  cards: Card[];
  isLoading?: boolean;
  onCardClick?: (card: Card) => void;
  onCardUpdate?: (updatedCard: Card) => void;
  isReadOnly?: boolean;
  onCardDelete?: (cardId: string) => Promise<void>;
  viewType?: 'kanban' | 'matrix';
}

// Traditional Kanban columns
const KANBAN_COLUMNS: ColumnData[] = [
  { id: 'todo-column', status: 'TODO', title: 'To Do', color: 'blue' },
  { id: 'in-progress-column', status: 'IN_PROGRESS', title: 'In Progress', color: 'amber' },
  { id: 'done-column', status: 'DONE', title: 'Done', color: 'green' }
];

// Eisenhower Matrix columns
const MATRIX_COLUMNS: ColumnData[] = [
  { 
    id: 'q1-column', 
    status: 'Q1', 
    title: 'Urgent & Important', 
    color: 'red',
  },
  { 
    id: 'q2-column', 
    status: 'Q2', 
    title: 'Important, Not Urgent', 
    color: 'purple',
  },
  { 
    id: 'q3-column', 
    status: 'Q3', 
    title: 'Urgent, Not Important', 
    color: 'orange',
  },
  { 
    id: 'q4-column', 
    status: 'Q4', 
    title: 'Not Urgent, Not Important', 
    color: 'gray',
  }
];

export default function KanbanBoard({
  cards,
  isLoading = false,
  onCardClick,
  onCardUpdate,
  isReadOnly = false,
  onCardDelete,
  viewType = 'kanban'
}: KanbanBoardProps): JSX.Element { 
  // State for drag and drop
  const [isDragging, setIsDragging] = useState<boolean>(false);
  
  // Select columns based on view type
  const activeColumns = viewType === 'matrix' ? MATRIX_COLUMNS : KANBAN_COLUMNS;
  
  const handleDragEnd = (result: DropResult) => { // Use DropResult type
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
    const destinationColumn = activeColumns.find(col => col.id === destination.droppableId);
    if (!destinationColumn) return;
    // Determine if we need to update importance and urgency based on quadrant
    let importance = card.importance;
    let urgency = card.urgency;
    
    // Update importance and urgency if moving between Eisenhower quadrants
    if (viewType === 'matrix') {
      switch (destinationColumn.status) {
        case 'Q1':
          importance = true;
          urgency = true;
          break;
        case 'Q2':
          importance = true;
          urgency = false;
          break;
        case 'Q3':
          importance = false;
          urgency = true;
          break;
        case 'Q4':
          importance = false;
          urgency = false;
          break;
      }
    }
    
    const updatedCard: Card = {
      ...card,
      status: destinationColumn.status,
      order: destination.index,
      importance,
      urgency
    };
    if (onCardUpdate) onCardUpdate(updatedCard);
  };

  return (
    // Restore DragDropContext wrapper
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
          className={`grid grid-cols-1 ${
            viewType === 'matrix' 
              ? 'md:grid-cols-2' // 2x2 grid for Eisenhower Matrix
              : 'md:grid-cols-3' // 3-column layout for Kanban
          } gap-4 h-full`}
          aria-orientation="horizontal"
        >
          {activeColumns.map((column) => (
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
              onCardDelete={onCardDelete} 
            />
          ))}
        </div>
        
        {/* Matrix description */}
        {viewType === 'matrix' && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg text-sm text-gray-700">
            <h3 className="font-semibold mb-1">Eisenhower Matrix Guide:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="text-red-600 font-medium">Urgent & Important:</span> Tasks requiring immediate attention</li>
              <li><span className="text-purple-600 font-medium">Important, Not Urgent:</span> Tasks for long-term planning</li>
              <li><span className="text-orange-600 font-medium">Urgent, Not Important:</span> Tasks that can be delegated</li>
              <li><span className="text-gray-600 font-medium">Not Urgent, Not Important:</span> Tasks that can be eliminated</li>
            </ul>
          </div>
        )}
        {/* Restore screen reader announcement div */}
        <div className="sr-only" aria-live="polite">
           {isDragging ? 'Card is being dragged' : ''}
        </div> 
      </div> 
    </DragDropContext> 
  ); 
}
