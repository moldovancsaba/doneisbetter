'use client';

import CardItem from './CardItem'; // Import the CardItem component

export default function Column({ title, cards, onStatusUpdate }) {
  return (
    // Container for a single column
    <div className="kanban-column">
      {/* Column title, showing the count of cards */}
      <h2 className="column-title">{title} ({cards ? cards.length : 0})</h2>
      {/* Container for the list of cards within the column */}
      <div className="card-list-in-column">
         {/* Display a message if the column is empty */}
         {(!cards || cards.length === 0) && <p className="empty-column-message">Empty</p>}
         {/* Map over the cards array and render a CardItem for each */}
        {(cards || []).map(card => (
          <CardItem
            key={card.id} // Unique key for React
            card={card} // Pass the card data
            // Pass the status update handler down to the CardItem
            onStatusUpdate={onStatusUpdate}
          />
        ))}
      </div>
    </div>
  );
}

