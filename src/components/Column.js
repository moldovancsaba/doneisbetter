'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import CardItem from './CardItem';

// MODIFIED: Accept 'id' prop which will be 'Deleted', 'Active', or 'Done'
export default function Column({ id, title, cards }) {
  // Make this component a droppable area using its id
  const { setNodeRef } = useDroppable({ id });

  // Get an array of card IDs for SortableContext
  // Ensure cards is an array before mapping
  const cardIds = Array.isArray(cards) ? cards.map(card => card.id) : [];

  return (
    // Assign the ref from useDroppable to the column's root element
    <div ref={setNodeRef} className="kanban-column">
      {/* Display the column title and the number of cards */}
      <h2 className="column-title">{title} ({cardIds.length})</h2>

      {/*
         Wrap the list of cards in SortableContext.
         This allows dnd-kit to manage the dragging and reordering *within* this column
         (though we are primarily using it for dragging *between* columns here).
         It needs the list of item IDs.
      */}
      <SortableContext
        id={id} // Identifier for this sortable context (matches droppable id)
        items={cardIds} // Array of unique IDs of the sortable items
        strategy={verticalListSortingStrategy} // Defines how items are arranged
      >
        <div className="card-list-in-column">
          {/* Show message if no cards */}
          {cardIds.length === 0 && <p className="empty-column-message">Empty</p>}
          {/* Render each card using CardItem */}
          {/* Ensure cards is an array before mapping */}
          {(Array.isArray(cards) ? cards : []).map(card => (
            // CardItem is now made sortable via useSortable hook (in its own file)
            <CardItem key={card.id} card={card} />
            // Note: onStatusUpdate is no longer passed down; handled by KanbanBoard's onDragEnd
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

