'use client';

import { Card, CardStatus } from '../types/card';

export interface ColumnProps {
  /**
   * Title displayed at the top of the column
   */
  title: string;
  
  /**
   * Array of cards to display in this column
   */
  cards: Card[];
  
  /**
   * Status that this column represents
   */
  status: CardStatus;
  
  /**
   * CSS color class for styling the column
   */
  color?: 'blue' | 'amber' | 'green';
  
  /**
   * Whether the column is in a loading state
   */
  isLoading?: boolean;
  
  /**
   * Optional handler for when a card is clicked
   */
  onCardClick?: (card: Card) => void;
}

/**
 * Column component for displaying cards of a specific status in a Kanban board
 */
export default function Column({
  title,
  cards,
  status,
  color = 'blue',
  isLoading = false,
  onCardClick
}: ColumnProps): JSX.Element {
  // Map color prop to actual Tailwind classes
  const colorClasses = {
    blue: 'border-blue-300 bg-blue-50',
    amber: 'border-amber-300 bg-amber-50',
    green: 'border-green-300 bg-green-50'
  };
  
  const headerColors = {
    blue: 'bg-blue-200 text-blue-800',
    amber: 'bg-amber-200 text-amber-800',
    green: 'bg-green-200 text-green-800'
  };
  
  // Filter cards to only include those matching this column's status
  const filteredCards = cards.filter(card => card.status === status || 
    (!card.status && status === 'TODO')); // Cards without status default to TODO
  
  return (
    <section 
      className={`flex flex-col h-full min-h-[300px] border rounded-lg ${colorClasses[color]} overflow-hidden`}
      aria-labelledby={`column-${status}-heading`}
    >
      <header className={`p-3 ${headerColors[color]} font-semibold flex justify-between items-center`}>
        <h2 
          id={`column-${status}-heading`} 
          className="text-base"
        >
          {title}
        </h2>
        <span className="text-sm rounded-full px-2 py-0.5 bg-white">
          {filteredCards.length}
        </span>
      </header>
      
      <div className="flex-1 p-2 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse flex flex-col space-y-2 w-full">
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : filteredCards.length === 0 ? (
          <div 
            className="flex items-center justify-center h-full text-gray-500 text-sm"
            aria-live="polite"
          >
            No cards in {title.toLowerCase()}
          </div>
        ) : (
          <ul 
            className="space-y-2"
            role="list"
            aria-label={`${title} cards`}
          >
            {filteredCards.map(card => (
              <li 
                key={card.id}
                className="p-3 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onCardClick && onCardClick(card)}
                tabIndex={0}
                role="button"
                aria-pressed="false"
              >
                <div className="text-gray-800">{card.content}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

