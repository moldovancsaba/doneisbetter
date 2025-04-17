'use client';

// Import ONLY from @hello-pangea/dnd
import { Droppable } from '@hello-pangea/dnd';
import CardItem from './CardItem';
import { useState, useEffect } from 'react'; // Added for safeCards state

export default function Column({ droppableId, title, cards }) {
  // Use state to ensure cards is always an array and handle updates
  const [safeCards, setSafeCards] = useState([]);
  useEffect(() => {
    setSafeCards(Array.isArray(cards) ? cards : []);
  }, [cards]); // Update state when cards prop changes


  return (
    <div className="kanban-column">
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
          >
            {safeCards.length === 0 && !snapshot.isDraggingOver && <p className="empty-column-message">Empty</p>}
            {safeCards.map((card, index) => (
              <CardItem
                key={card._id}
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
