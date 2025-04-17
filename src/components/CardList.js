'use client';

import { useState, useEffect } from 'react';
import CardItem from './CardItem'; // We'll create this next

export default function CardList({ initialCards }) {
  // Manage cards locally for optimistic updates and client-side state
  const [cards, setCards] = useState(initialCards || []);

  // Update local state if initialCards prop changes (e.g., after adding a new card)
  useEffect(() => {
    setCards(initialCards || []);
  }, [initialCards]);

  // Function to remove card from local state optimistically after successful swipe action
  const handleSwipeComplete = (cardId) => {
    setCards((currentCards) => currentCards.filter(card => card.id !== cardId));
    // Note: In a production app, consider more robust error handling
    // if the server action failed *after* the optimistic update.
    // This might involve showing a notification or reverting the state.
  };

  return (
    <div className="card-list">
      {cards.length === 0 && <p className="text-center text-gray-500">No active cards. Add one above!</p>}
      {cards.map((card) => (
        <CardItem
          key={card.id}
          card={card}
          onSwipeComplete={handleSwipeComplete} // Pass callback to CardItem
        />
      ))}
    </div>
  );
}

