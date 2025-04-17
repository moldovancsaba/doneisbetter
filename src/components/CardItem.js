'use client';
// Make sure this is the only import from this library
import { Draggable } from '@hello-pangea/dnd';

export default function CardItem({ card, index }) {
  // Ensure card and card.createdAt exist before rendering
  if (!card || typeof card.createdAt === 'undefined') {
    console.warn("CardItem received invalid card data:", card);
    return null; // Don't render if data is invalid
  }

  // Explicitly ensure we are working with the string format
  const createdAtString = String(card.createdAt);

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`card-item-draggable ${snapshot.isDragging ? 'dragging' : ''}`}
          style={{
            ...provided.draggableProps.style,
            userSelect: 'none',
          }}
        >
          <div className="card">
            <p>{card.content}</p>
            {/* RE-CONFIRMED: Display the ISO string directly */}
            <time dateTime={createdAtString} className="card-time">
              {createdAtString}
            </time>
          </div>
        </div>
      )}
    </Draggable>
  ); // End of return statement
} // End of CardItem component function
