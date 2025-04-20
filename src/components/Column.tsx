'use client';

import { useState, useEffect } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import CardItem from './CardItem';
import { Card } from '@/app/page';

// Props interface
interface ColumnProps {
  droppableId: string;
  title: string;
  cards: Card[];
}

export default function Column({ droppableId, title, cards }: ColumnProps) {
  // State with proper type
  const [safeCards, setSafeCards] = useState<Card[]>([]);
  
  // Update state when cards prop changes
  useEffect(() => {
    setSafeCards(Array.isArray(cards) ? cards : []);
  }, [cards]);

  return (
    <div 
      className="kanban-column" 
      role="region" 
      aria-label={`${title} column with ${safeCards.length} cards`}
    >
      <h2 className="column-title">
        <span className="column-title-text">{title}</span>
        <span className="column-title-count">({safeCards.length})</span>
      </h2>

      <Droppable droppableId={droppableId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`card-list-in-column ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
            data-column-id={droppableId}
          >
            {safeCards.length === 0 && !snapshot.isDraggingOver && (
              <p className="empty-column-message">Empty</p>
            )}
            
            {safeCards.map((card, index) => (
              <CardItem
                key={card.id}
                card={card}
                index={index}
              />
            ))}
            
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

