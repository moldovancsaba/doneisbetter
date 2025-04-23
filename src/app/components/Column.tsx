'use client';

import { Card, CardStatus } from '../types/card';
import { Droppable, Draggable } from '@hello-pangea/dnd';

export interface ColumnProps {
  /**
   * Title displayed at the top of the column
   */
  title: string;
  
  /**
   * Status that this column represents
   */
  status: CardStatus;
  
  /**
   * Unique identifier for the column, used as droppableId
   */
  id: string;
  
  /**
   * Array of cards to display in this column
   */
  cards: Card[];
  
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
  id,
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
  const filteredCards = cards.filter(card => {
    const isMatchingStatus = card.status === status;
    const isDefaultTodo = !card.status && status === 'TODO';
    return isMatchingStatus || isDefaultTodo;
  }); // Semicolon marks end of filter logic
  
  // Explicitly start return statement on new line
  return (
    <section // Opening section tag
      className={`flex flex-col h-full min-h-[300px] border rounded-lg ${colorClasses[color]} overflow-hidden`} // ClassName template literal
      aria-labelledby={`column-${status}-heading`} // aria-labelledby template literal
    > {/* Closing bracket for opening section tag */}
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
      
      <Droppable droppableId={id} type="CARD">
        {(provided, snapshot) => (
          <div 
            className={`flex-1 p-2 overflow-y-auto ${snapshot.isDraggingOver ? 'bg-gray-50' : ''}`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
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
                {provided.placeholder}
              </div>
            ) : (
              <ul 
                className="space-y-2"
                role="list"
                aria-label={`${title} cards`}
              >
                {filteredCards.map((card, index) => (
                  <Draggable 
                    key={card.id} 
                    draggableId={card.id} 
                    index={index}
                    isDragDisabled={isLoading}
                  >
                    {(provided, snapshot) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`p-3 bg-white rounded-md shadow-sm transition-shadow
                          ${snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-300' : 'hover:shadow-md'}
                          ${isLoading ? 'opacity-60' : 'cursor-pointer'}`}
                        onClick={() => !snapshot.isDragging && onCardClick && onCardClick(card)}
                        tabIndex={0}
                        role="button"
                        aria-pressed="false"
                        aria-roledescription="Draggable item"
                        data-testid={`card-${card.id}`} // Ensure only one data-testid
                      >
                        <div className="text-gray-800 mb-1">{card.content}</div>
                        {card.createdAt && ( // Check if createdAt exists
                          <small className="text-xs text-gray-500 block mt-1">
                            Created: {new Date(card.createdAt).toLocaleString()} {/* Optionally format */}
                            {/* Or display raw ISO string: {card.createdAt} */}
                          </small>
                        )}
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </div>
        )}
      </Droppable>
    </section>
  );
}
