'use client';

// Import ONLY from @hello-pangea/dnd
import { Droppable } from '@hello-pangea/dnd';
import CardItem from './CardItem';

export default function Column({ droppableId, title, cards }) {
  // Ensure cards is always an array for safe mapping
  const safeCards = Array.isArray(cards) ? cards : [];

  return (
    // REMOVED ref={setNodeRef} from this div
    <div className="kanban-column">
      <h2 className="column-title">
         <span className="column-title-text">{title}</span>
         {/* CORRECTED: Use safeCards.length */}
         <span className="column-title-count">({safeCards.length})</span>
      </h2>

      {/* Use Droppable component */}
      <Droppable droppableId={droppableId}>
        {(provided, snapshot) => (
          // Apply ref and props to the list container div
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`card-list-in-column ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
          >
            {/* REMOVED Commented out/incorrect code block */}

            {/* Show message if no cards AND not dragging over */}
            {safeCards.length === 0 && !snapshot.isDraggingOver && <p className="empty-column-message">Empty</p>}

            {/* Map over safeCards */}
            {safeCards.map((card, index) => (
              <CardItem
                key={card.id}
                card={card}
                index={index} // Pass index required by Draggable
              />
            ))}
            {/* Placeholder adds space when dragging */}
            {provided.placeholder}
          </div> // End div for droppable area
        )}
      </Droppable> // End Droppable component
    </div> // End main column div
  );
}
