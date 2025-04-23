'use client';

import { Card, CardStatus, ColumnData } from '../types/card';
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
}

/**
 * The column configurations for the Kanban board
 */
const COLUMNS: ColumnData[] = [
  {
    status: 'TODO',
    title: 'To Do',
    color: 'blue'
  },
  {
    status: 'IN_PROGRESS',
    title: 'In Progress',
    color: 'amber'
  },
  {
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
  onCardClick
}: KanbanBoardProps): JSX.Element {
  return (
    <div 
      className="h-full" 
      role="region" 
      aria-label="Kanban board"
    >
      <div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full"
        aria-orientation="horizontal"
      >
        {COLUMNS.map((column) => (
          <Column
            key={column.status}
            title={column.title}
            status={column.status}
            cards={cards}
            color={column.color}
            isLoading={isLoading}
            onCardClick={onCardClick}
          />
        ))}
      </div>
    </div>
  );
}

