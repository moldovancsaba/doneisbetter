'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners // Or closestCenter based on preference
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import Column from './Column';
import { updateCardStatus } from '@/app/actions'; // Server action

// Helper function to map column ID to status
const mapIdToStatus = (id) => {
    if (id === 'Deleted') return 'deleted';
    if (id === 'Done') return 'done';
    return 'active'; // Default to 'active' (for 'Active' column or unexpected IDs)
}

export default function KanbanBoard({ initialCards }) {
  // State for each column
  const [activeCards, setActiveCards] = useState([]);
  const [doneCards, setDoneCards] = useState([]);
  const [deletedCards, setDeletedCards] = useState([]);
  const [isClient, setIsClient] = useState(false); // Prevent hydration mismatch

  // Initialize columns on mount and when initialCards changes
  useEffect(() => {
    setIsClient(true); // Indicate client-side rendering is active
    // Filter cards into columns based on their status
    setActiveCards((initialCards || []).filter(card => card.status === 'active'));
    setDoneCards((initialCards || []).filter(card => card.status === 'done'));
    setDeletedCards((initialCards || []).filter(card => card.status === 'deleted'));
  }, [initialCards]); // Rerun when initial cards data updates

  // Configure sensors for drag detection (pointer and keyboard)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Helper function to find which column a card currently resides in
  const findColumn = (cardId) => {
    if (activeCards.some(c => c.id === cardId)) return 'Active';
    if (doneCards.some(c => c.id === cardId)) return 'Done';
    if (deletedCards.some(c => c.id === cardId)) return 'Deleted';
    return null; // Card not found (shouldn't normally happen)
  };

  // Function triggered when a drag operation completes
  const handleDragEnd = (event) => {
    const { active, over } = event;

    // If dropped outside a valid column (droppable area), do nothing
    if (!over) return;

    const activeId = active.id; // ID of the card being dragged
    const overId = over.id;     // ID of the column dropped onto

    const activeColumnId = findColumn(activeId); // Find original column ID
    const overColumnId = overId; // Destination column ID

    // Only perform updates if the card was dropped into a *different* column
    if (activeColumnId && activeColumnId !== overColumnId) {
      console.log(`Moving card ${activeId} from ${activeColumnId} to ${overColumnId}`);

      const newStatus = mapIdToStatus(overColumnId); // Determine new status from column ID
      let cardToMove = null;

      // --- Optimistic Update ---
      // 1. Find and remove the card from its original list state
      const removeFromList = (setter) => {
         setter(current => {
            const cardIndex = current.findIndex(c => c.id === activeId);
            if (cardIndex > -1) {
                cardToMove = current[cardIndex]; // Store the found card
                // Return new array excluding the moved card
                return [...current.slice(0, cardIndex), ...current.slice(cardIndex + 1)];
            }
            return current; // Return original array if card not found
        });
      };

      // Call remove function based on the original column
       if (activeColumnId === 'Active') removeFromList(setActiveCards);
       else if (activeColumnId === 'Done') removeFromList(setDoneCards);
       else if (activeColumnId === 'Deleted') removeFromList(setDeletedCards);

      // 2. If the card was successfully found and removed
      if (cardToMove) {
         cardToMove.status = newStatus; // Update the card object's status locally

         // 3. Add the card to the beginning of the new column's list state
         const addToList = (setter) => setter(current => [cardToMove, ...current]);

         if (overColumnId === 'Active') addToList(setActiveCards);
         else if (overColumnId === 'Done') addToList(setDoneCards);
         else if (overColumnId === 'Deleted') addToList(setDeletedCards);

         // --- Server Action Call (Fire and Forget) ---
         // Call the server action asynchronously to update the database
         updateCardStatus(activeId, newStatus).then(result => {
           if (!result.success) {
             // If the server update fails: Log error, show alert, attempt reversal
             console.error(`Server failed to update card ${activeId} to ${newStatus}:`, result.error);
             alert(`Error saving change for card "${cardToMove.content}": ${result.error}`);
             handleStatusUpdateReversal(activeId, activeColumnId); // Attempt to move card back visually
           } else {
             // Log success if needed
             console.log(`Server confirmed update for card ${activeId} to ${newStatus}`);
           }
         }).catch(err => {
             // If there's a network error calling the server action
             console.error(`Network error updating card ${activeId} to ${newStatus}:`, err);
             alert(`Network error saving change for card "${cardToMove.content}".`);
             handleStatusUpdateReversal(activeId, activeColumnId); // Attempt to move card back visually
         });

      } else {
           // Log warning if the card wasn't found where expected
           console.warn(`Card ${activeId} not found in expected column ${activeColumnId}`);
      }
    } else {
      // Log if dropped in the same column or invalid area
      console.log(`Card ${activeId} dropped in same column or invalid area.`);
    }
  };

  // Basic reversal function for optimistic update failures
    const handleStatusUpdateReversal = (cardId, originalColumnId) => {
        // This is tricky because the card might have been moved *again*
        // For simplicity, we just try to move it back based on the original state known during the failed action
        const originalStatus = mapIdToStatus(originalColumnId);
        let cardToMoveBack = null;

        // Find and remove from potentially incorrect *new* list
        const findAndRemoveFromNew = (setter) => {
            setter(current => {
                const cardIndex = current.findIndex(c => c.id === cardId);
                if (cardIndex > -1) {
                    cardToMoveBack = current[cardIndex];
                    return [...current.slice(0, cardIndex), ...current.slice(cardIndex + 1)];
                }
                return current;
            });
        };
        findAndRemoveFromNew(setActiveCards);
        findAndRemoveFromNew(setDoneCards);
        findAndRemoveFromNew(setDeletedCards);

        // Add back to the *original* list
        if (cardToMoveBack) {
             cardToMoveBack.status = originalStatus; // Reset status
             const addBackToList = (setter) => setter(current => [cardToMoveBack, ...current]);
             if (originalColumnId === 'Active') addBackToList(setActiveCards);
             else if (originalColumnId === 'Done') addBackToList(setDoneCards);
             else if (originalColumnId === 'Deleted') addBackToList(setDeletedCards);
             console.log(`Attempted to visually revert card ${cardId} back to ${originalColumnId}`);
        } else {
             console.warn(`Could not find card ${cardId} to revert.`);
             // Consider a full data refresh in this case
        }
   };


    // Prevent rendering DndContext on the server to avoid hydration errors
  if (!isClient) {
    // Render a simple placeholder or skeleton during server render / initial hydration
    return <div className="text-center p-10">Loading Board...</div>;
  }

  return (
    // DndContext wrapper providing drag-and-drop context
    <DndContext
      sensors={sensors} // Use configured sensors
      collisionDetection={closestCorners} // Strategy for determining drop target
      onDragEnd={handleDragEnd} // Callback function when drag ends
    >
      <div className="kanban-board">
        {/* Render each column, passing its ID, title, and current cards */}
        <Column id="Deleted" title="Deleted" cards={deletedCards} />
        <Column id="Active" title="Active" cards={activeCards} />
        <Column id="Done" title="Done" cards={doneCards} />
      </div>
    </DndContext>
  );
} // <-- Added missing closing brace
