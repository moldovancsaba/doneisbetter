'use client';

// CORRECTED: Import ONLY from @hello-pangea/dnd
import { Droppable } from '@hello-pangea/dnd';
import CardItem from './CardItem';

// MODIFIED: Accept 'droppableId' prop instead of 'id' to match Droppable component
export default function Column({ droppableId, title, cards }) {
  // Ensure cards is always an array
  const safeCards = Array.isArray(cards) ? cards : [];

  return (
    <div className="kanban-column">
      <h2 className="column-title">{title} ({safeCards.length})</h2>
      {/* Use Droppable from @hello-pangea/dnd */}
      <Droppable droppableId={droppableId}>
        {(provided, snapshot) => (
          // Apply the ref and props from the Droppable render prop
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`card-list-in-column ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
          >
            {/* Show message if no cards AND not dragging over */}
            {safeCards.length === 0 && !snapshot.isDraggingOver && <p className="empty-column-message">Empty</p>}
            {/* Map cards to Draggable CardItems */}
            {safeCards.map((card, index) => (
              <CardItem
                key={card.id}
                card={card}
                index={index} // Pass index required by Draggable
              />
            ))}
            {/* Placeholder adds space when dragging */}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

