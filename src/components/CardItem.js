'use client';

// CORRECTED: Import ONLY from @hello-pangea/dnd
import { Draggable } from '@hello-pangea/dnd';

// Removed @dnd-kit imports, useSortable hook, and associated styles

export default function CardItem({ card, index }) { // Receive index prop
  return (
    // Use Draggable from @hello-pangea/dnd
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        // Outer div gets the ref and draggable props
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps} // dragHandleProps attach to the element that should be grabbed
          className={`card-item-draggable ${snapshot.isDragging ? 'dragging' : ''}`}
          // Apply styles provided by the library, plus any custom styles
          style={{
            ...provided.draggableProps.style, // Important for positioning during drag
            userSelect: 'none', // Prevent text selection
            // Add other base styles if needed, or rely on CSS classes
          }}
        >
          {/* Inner div represents the visual card */}
          <div className="card">
            <p>{card.content}</p>
            <time className="card-time">
              {new Date(card.createdAt).toLocaleString()}
            </time>
          </div>
        </div>
      )}
    </Draggable>
  );
}

