'use client';

import React from 'react';
import { Card, CardStatus } from '../types/card';
import { Droppable, Draggable } from '@hello-pangea/dnd';

export interface ColumnProps {
  title: string;
  status: CardStatus;
  id: string; // Droppable ID
  cards: Card[];
  color?: 'blue' | 'amber' | 'green' | 'red' | 'purple' | 'orange' | 'gray';
  isLoading?: boolean;
  onCardClick?: (card: Card) => void;
  isReadOnly?: boolean;
  onCardDelete?: (cardId: string) => Promise<void>;
  bgColor?: string; // Added custom background color
  borderColor?: string; // Added custom border color
  isDeletedView?: boolean; // Added for deleted cards view
}

// Color mapping
const colorClasses = {
  blue: 'border-blue-300 bg-blue-50',
  amber: 'border-amber-300 bg-amber-50',
  green: 'border-green-300 bg-green-50',
  red: 'border-red-300 bg-red-50',
  purple: 'border-purple-300 bg-purple-50',
  orange: 'border-orange-300 bg-orange-50',
  gray: 'border-gray-300 bg-gray-50',
};
const headerColors = {
  blue: 'bg-blue-100 text-blue-800',
  amber: 'bg-amber-100 text-amber-800',
  green: 'bg-green-100 text-green-800',
  red: 'bg-red-100 text-red-800',
  purple: 'bg-purple-100 text-purple-800',
  orange: 'bg-orange-100 text-orange-800',
  gray: 'bg-gray-100 text-gray-800',
};

const Column: React.FC<ColumnProps> = ({
  title,
  status,
  id,
  cards,
  color = 'blue',
  isLoading = false,
  onCardClick,
  isReadOnly = false,
  onCardDelete,
  bgColor,
  borderColor,
  isDeletedView = false,
}) => {
  // Filter cards for this column
  const filteredCards = cards.filter(card => {
    const isMatchingStatus = card.status === status;
    const isDefaultTodo = !card.status && status === 'TODO';
    return isMatchingStatus || isDefaultTodo;
  });

  return (
    <section
      className={`flex flex-col h-full min-h-[300px] border rounded-lg ${bgColor || colorClasses[color]} ${borderColor || ''} overflow-hidden`}
      aria-labelledby={`column-${status}-heading`}
    >
      <header className={`p-3 font-semibold ${headerColors[color]} border-b ${borderColor || colorClasses[color].replace('bg-', 'border-')}`}>
        <h2 id={`column-${status}-heading`} className="flex justify-between items-center text-sm uppercase tracking-wide">
          {title}
          <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-gray-200 text-gray-700">
            {isLoading ? '...' : filteredCards.length}
          </span>
        </h2>
      </header>

      <Droppable droppableId={id} type="CARD">
        {(provided, snapshot) => (
          <div // Main content div for the Droppable area
            className={`flex-1 p-2 overflow-y-auto ${snapshot.isDraggingOver ? 'bg-gray-100' : ''}`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {/* Conditional Rendering */}
            {isLoading ? (
              <div className="flex items-center justify-center h-full"> {/* Loading State */}
                <div className="animate-pulse flex flex-col space-y-2 w-full p-2">
                  <div className="h-20 bg-gray-200 rounded"></div>
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              </div>
            ) : filteredCards.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500 text-sm" aria-live="polite"> {/* Empty State */}
                No cards in {title.toLowerCase()}
              </div>
            ) : (
              <ul className="space-y-2" role="list" aria-label={`${title} cards`}> {/* Card List */}
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
                        className={`p-3 bg-white rounded-md shadow-sm transition-shadow mb-2
                          ${snapshotDraggable.isDragging ? 'shadow-lg ring-2 ring-blue-300' : 'hover:shadow-md'}
                          ${isReadOnly || isLoading ? 'opacity-60 cursor-default' : 'cursor-pointer'}`}
                        onClick={() => !isReadOnly && !snapshotDraggable.isDragging && onCardClick && onCardClick(card)}
                        role={isReadOnly ? undefined : "button"}
                        aria-pressed={isReadOnly ? undefined : "false"}
                        data-testid={`card-${card.id}`}
                        style={{ ...providedDraggable.draggableProps.style }}
                      >
                        <div className="flex justify-between items-start w-full">
                          <div className="flex-1 mr-2 overflow-hidden">
                            {isReadOnly && (card.userImage || card.userName) && ( // User Info
                              <div className="flex items-center mb-2 space-x-2 border-b border-gray-200 pb-1">
                                {card.userImage && <img src={card.userImage} alt={card.userName ? `${card.userName}'s avatar` : 'User avatar'} className="w-5 h-5 rounded-full flex-shrink-0" loading="lazy" />}
                                {card.userName && <span className="text-xs text-gray-600 truncate font-medium">{card.userName}</span>}
                              </div>
                            )}
                            <div className="text-gray-800 text-sm mb-1 break-words">{card.content}</div> {/* Content */}
                            {card.createdAt && <small className="text-xs text-gray-500 block mt-1">🕒 {card.createdAt}</small>} {/* Timestamp */}
                          </div>
                          {!isReadOnly && !isDeletedView && ( // Delete Button
                            <button
                              className="p-1 text-gray-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 rounded-full flex-shrink-0 ml-1"
                              onClick={(e) => { e.stopPropagation(); if (onCardDelete) onCardDelete(card.id); }}
                              aria-label={`Delete card "${card.content}"`}
                              title="Delete card"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          )}
                        </div>
                      </li>
                    )}
                  </Draggable>
                ))} {/* End map */}
              </ul> // End ul
            )} {/* End ternary */}
            {provided.placeholder} {/* Droppable placeholder */}
          </div> // End main content div
        )}
      </Droppable>
    </section>
  ); // End return
}; // End component definition

export default Column; // Export default
