'use client';

import React from 'react';
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
  
  /**
   * If true, disables interactions like drag-and-drop and clicks
   */
  isReadOnly?: boolean;
}

/**
 * Column component for displaying cards of a specific status in a Kanban board
 */
const Column: React.FC<ColumnProps> = ({
  title,
  cards,
  status,
  id,
  color = 'blue',
  isLoading = false,
  onCardClick,
  isReadOnly = false
}): JSX.Element => {
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
  });
  
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
      
      <Droppable droppableId={id} type="CARD">
        {(provided, snapshot) => (
          <div // Main content div for the Droppable area
            className={`flex-1 p-2 overflow-y-auto ${snapshot.isDraggingOver ? 'bg-gray-100' : ''}`} // Added subtle hover effect
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {/* Conditional Rendering: Loading State */}
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-pulse flex flex-col space-y-2 w-full p-2">
                  {/* Skeleton Loaders */}
                  <div className="h-20 bg-gray-200 rounded"></div>
                  <div className="h-16 bg-gray-200 rounded"></div>
                  <div className="h-24 bg-gray-200 rounded"></div>
                </div>
              </div>
            ) :
            /* Conditional Rendering: Empty State */
            filteredCards.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500 text-sm" aria-live="polite">
                No cards in {title.toLowerCase()}
              </div>
            ) : (
            /* Conditional Rendering: Card List */
              <ul
                className="space-y-2" // Styling for the list
                role="list"
                aria-label={`${title} cards`}
              >
                {/* Map over filtered cards */}
                {filteredCards.map((card, index) => (
                  <Draggable
                    key={card.id}
                    draggableId={card.id}
                    index={index}
                    isDragDisabled={isReadOnly || isLoading}
                  >
                    {(providedDraggable, snapshotDraggable) => (
                      <li
                        ref={providedDraggable.innerRef}
                        {...providedDraggable.draggableProps}
                        {...providedDraggable.dragHandleProps}
                        className={`p-3 bg-white rounded-md shadow-sm transition-shadow mb-2 // mb-2 for spacing
                          ${snapshotDraggable.isDragging ? 'shadow-lg ring-2 ring-blue-300' : 'hover:shadow-md'}
                          ${isReadOnly || isLoading ? 'opacity-60 cursor-default' : 'cursor-pointer'}`}
                        onClick={() => !isReadOnly && !snapshotDraggable.isDragging && onCardClick && onCardClick(card)}
                        role={isReadOnly ? undefined : "button"}
                        aria-pressed={isReadOnly ? undefined : "false"}
                        data-testid={`card-${card.id}`}
                        style={{ ...providedDraggable.draggableProps.style }} // Apply draggable styles
                      >
                        {/* Conditionally display user info in read-only mode */}
                        {isReadOnly && (card.userImage || card.userName) && (
                          <div className="flex items-center mb-2 space-x-2 border-b border-gray-200 pb-1">
                            {card.userImage && (
                              <img
                                src={card.userImage}
                                alt={card.userName ? `${card.userName}'s avatar` : 'User avatar'}
                                className="w-5 h-5 rounded-full flex-shrink-0" // Slightly larger avatar
                                loading="lazy" // Lazy load images
                              />
                            )}
                            {card.userName && ( // Optionally display name
                               <span className="text-xs text-gray-600 truncate font-medium">{card.userName}</span>
                            )}
                          </div>
                        )}
                        {/* Card content */}
                        <div className="text-gray-800 text-sm mb-1 break-words">{card.content}</div>
                        {/* Timestamp */}
                        {card.createdAt && (
                          <small className="text-xs text-gray-500 block mt-1">
                            🕒 {card.createdAt}
                          </small>
                        )}
                      </li>
                    )}
                  </Draggable>
                ))} {/* End of map function call */}
              </ul> // End of ul
            )} {/* End of ternary operator */}
            {provided.placeholder} {/* Droppable placeholder */}
          </div> // End of main content div for Droppable
        )}
      </Droppable>
    </section>
  );
};

export default Column;
