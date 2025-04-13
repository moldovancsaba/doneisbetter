'use client';

import { useState, useEffect } from 'react';
import Column from './Column'; // We will create this next

export default function KanbanBoard({ initialCards }) {
  // State for each column, initialized as empty arrays
  const [activeCards, setActiveCards] = useState([]);
  const [doneCards, setDoneCards] = useState([]);
  const [deletedCards, setDeletedCards] = useState([]);

  // Effect runs when initialCards prop changes (e.g., on page load or after adding a new card)
  useEffect(() => {
    // Filter the initial cards into their respective columns based on status
    setActiveCards((initialCards || []).filter(card => card.status === 'active'));
    setDoneCards((initialCards || []).filter(card => card.status === 'done'));
    setDeletedCards((initialCards || []).filter(card => card.status === 'deleted'));
  }, [initialCards]); // Dependency array ensures this runs when initialCards updates

  // Handler called by CardItem after a successful status update via server action
  const handleStatusUpdate = (cardId, newStatus) => {
    let cardToMove = null;

    // Find the card in *any* of the current state lists and remove it
    // This ensures we find the card regardless of its previous state (though usually it's 'active')
    const findAndRemove = (setter) => {
        setter(current => {
            const cardIndex = current.findIndex(c => c.id === cardId);
            if (cardIndex > -1) {
                cardToMove = current[cardIndex]; // Store the card to move
                // Return a new array without the found card
                return [...current.slice(0, cardIndex), ...current.slice(cardIndex + 1)];
            }
            return current; // Return unchanged if not found
        });
    };

    findAndRemove(setActiveCards);
    findAndRemove(setDoneCards);
    findAndRemove(setDeletedCards);

    // If the card was found and removed from a list
    if (cardToMove) {
        cardToMove.status = newStatus; // Update the card's status locally

        // Add the card to the beginning of the appropriate new list based on newStatus
        if (newStatus === 'done') {
            setDoneCards(current => [cardToMove, ...current]);
        } else if (newStatus === 'deleted') {
            setDeletedCards(current => [cardToMove, ...current]);
        } else if (newStatus === 'active') { // Handle case if a card could be moved back to active
             setActiveCards(current => [cardToMove, ...current]);
        }
    } else {
        // Log a warning if the card wasn't found - might indicate a state inconsistency
        console.warn(`Card with ID ${cardId} not found in any list during status update to ${newStatus}.`);
        // Consider fetching all cards again to resync state if this happens frequently
        // getCards().then(setAllCards); // Example refetch
    }
  };

  return (
    // Render the three columns using a CSS grid layout
    <div className="kanban-board">
      {/* Pass title, card list, and the update handler to each Column */}
      <Column title="Deleted" cards={deletedCards} onStatusUpdate={handleStatusUpdate} />
      <Column title="Active" cards={activeCards} onStatusUpdate={handleStatusUpdate} />
      <Column title="Done" cards={doneCards} onStatusUpdate={handleStatusUpdate} />
    </div>
  );
}

