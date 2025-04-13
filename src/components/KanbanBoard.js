'use client';

import { useState, useEffect } from 'react';
// Correct import
import { DragDropContext } from '@hello-pangea/dnd';
import Column from './Column';
import { updateCardStatus, updateCardsOrder } from '@/app/actions';

export default function KanbanBoard({ initialCards }) {
  // --- State ---
  const [activeCards, setActiveCards] = useState([]);
  const [doneCards, setDoneCards] = useState([]);
  const [deletedCards, setDeletedCards] = useState([]);
  const [isClient, setIsClient] = useState(false); // Track client-side mount

  // --- Helper Functions (defined within component scope) ---

  // Maps column ID ('Active', 'Done', 'Deleted') to state details
  const getListInfo = (statusId) => {
    switch (statusId) {
      case 'Active': return { list: activeCards, setter: setActiveCards };
      case 'Done': return { list: doneCards, setter: setDoneCards };
      case 'Deleted': return { list: deletedCards, setter: setDeletedCards };
      default: return { list: [], setter: () => console.warn(`getListInfo: Setter not found for statusId: ${statusId}`) };
    }
  };

  // Maps column ID ('Active', etc.) to status string ('active', etc.)
  const mapIdToStatus = (id) => {
    if (id === 'Deleted') return 'deleted';
    if (id === 'Done') return 'done';
    return 'active'; // Default
  };

  // Finds the current column ID ('Active', 'Done', 'Deleted') for a card
  // Note: This relies on the current state, which might be outdated if reversal happens rapidly
  const findColumnId = (cardId) => {
    if (activeCards.some(c => c.id === cardId)) return 'Active';
    if (doneCards.some(c => c.id === cardId)) return 'Done';
    if (deletedCards.some(c => c.id === cardId)) return 'Deleted';
    return null;
  };

  // Reversal logic for optimistic updates failure
  const handleStateReversal = (cardId, originalColumnId, sourceListBeforeMove, destListBeforeMove) => {
     console.log(`Attempting state reversal for ${cardId} back to ${originalColumnId}`);
     const { setter: setSourceList } = getListInfo(originalColumnId);
     // Find where it might have ended up optimistically
     const currentDestColId = findColumnId(cardId);
     const { setter: setDestList } = getListInfo(currentDestColId);

      // Reset both lists to their state *before* the optimistic update attempt
     setSourceList(sourceListBeforeMove);
     // Only reset destList if it's different from sourceList
     if(currentDestColId && originalColumnId !== currentDestColId) {
       setDestList(destListBeforeMove);
     }

     alert(`Failed to save change. Card reverted.`);
     console.log(`Visually reverted card ${cardId}`);
  };
  // --- End Helper Functions ---


  // --- Effects ---
  // Initialize state from props after client mount OR if props change
  useEffect(() => {
    setIsClient(true); // Signal client-side now
    console.log("KanbanBoard: useEffect - Setting state from initialCards.");
    // Ensure initialCards is treated as an array
    const cards = Array.isArray(initialCards) ? initialCards : [];
    setActiveCards(cards.filter(card => card.status === 'active'));
    setDoneCards(cards.filter(card => card.status === 'done'));
    setDeletedCards(cards.filter(card => card.status === 'deleted'));
  }, [initialCards]); // Rerun if initialCards changes


  // --- Drag End Handler (for @hello-pangea/dnd) ---
  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    console.log("--- onDragEnd START ---");
    console.log("Source:", source);
    console.log("Destination:", destination);
    console.log("Draggable ID:", draggableId);

    // 1. Check if dropped outside a valid area
    if (!destination) { console.log("Dropped outside."); console.log("--- onDragEnd END ---"); return; }

    const sourceColId = source.droppableId;
    const destColId = destination.droppableId;
    const sourceIndex = source.index;
    const destIndex = destination.index;
    const cardId = draggableId;

    // 2. Check if dropped in the same place
    if (sourceColId === destColId && sourceIndex === destIndex) { console.log("No change."); console.log("--- onDragEnd END ---"); return; }

    // 3. Get state *before* move for potential reversal
    const sourceListBeforeMove = getListInfo(sourceColId).list;
    const destListBeforeMove = getListInfo(destColId).list;

    // 4. Find the card being moved
    const { list: sourceList, setter: setSourceList } = getListInfo(sourceColId);
    let cardToMove = sourceList[sourceIndex];

    if (!cardToMove || cardToMove.id !== cardId) { console.error(`Card mismatch! draggableId ${cardId} not found at index ${sourceIndex} in ${sourceColId}.`); console.log("--- onDragEnd END ---"); return; }

    console.log(`Attempting move: ${cardId} from ${sourceColId}[${sourceIndex}] to ${destColId}[${destIndex}]`);

    // 5. Optimistic Update: Remove from source list
    const newSourceList = Array.from(sourceList);
    newSourceList.splice(sourceIndex, 1);

    // --- CASE A: SAME COLUMN REORDER ---
    if (sourceColId === destColId) {
        console.log(`INTRA-column reorder`);
        // Insert into new position in the *modified* source list
        newSourceList.splice(destIndex, 0, cardToMove);
        setSourceList(newSourceList); // Update state optimistically

        // Persist Order
        const orderUpdates = newSourceList.map((card, index) => ({ id: card.id, order: index }));
        console.log("Calling updateCardsOrder:", orderUpdates);
        updateCardsOrder(orderUpdates).then(res => {
            if (!res.success) {
                console.error("Failed order save:", res.error);
                // Revert using original list states
                handleStateReversal(cardId, sourceColId, sourceListBeforeMove, destListBeforeMove); // Pass original states
            } else { console.log("Order save success."); }
        }).catch(err => {
            console.error("Network error saving order:", err);
            // Revert using original list states
            handleStateReversal(cardId, sourceColId, sourceListBeforeMove, destListBeforeMove); // Pass original states
        });
    // --- CASE B: DIFFERENT COLUMN MOVE ---
    } else {
        console.log(`INTER-column move`);
        const { list: destList, setter: setDestList } = getListInfo(destColId);
        // Create new list for destination based on its state *before* the move
        const newDestList = Array.from(destList);
        newDestList.splice(destIndex, 0, cardToMove); // Insert into destination list

        // Update state for BOTH columns optimistically
        setSourceList(newSourceList); // Source list (card removed)
        setDestList(newDestList);   // Dest list (card added)

        // Persist Status Change
        const newStatus = mapIdToStatus(destColId);
        console.log(`Calling updateCardStatus: ${cardId} to ${newStatus}`);
        updateCardStatus(cardId, newStatus).then(res => {
            if (!res.success) {
                console.error("Failed status save:", res.error);
                // Use the reversal logic, passing original list states
                handleStateReversal(cardId, sourceColId, sourceListBeforeMove, destListBeforeMove);
            } else { console.log("Status save success."); }
        }).catch(err => {
            console.error("Network error saving status:", err);
             // Use the reversal logic, passing original list states
            handleStateReversal(cardId, sourceColId, sourceListBeforeMove, destListBeforeMove);
        });
        // Note: Order persistence for destination column is NOT handled here.
    }
     console.log("--- onDragEnd END ---");
  };
  // --- End onDragEnd ---


  // --- Render Logic ---
  // Render placeholder if not client-side yet
  if (!isClient) {
    console.log("KanbanBoard: Rendering placeholder (not client yet).");
    return (
        <div className="kanban-board" aria-busy="true">
             <div className="kanban-column"><h2 className="column-title">Deleted (Loading...)</h2></div>
             <div className="kanban-column"><h2 className="column-title">Active (Loading...)</h2></div>
             <div className="kanban-column"><h2 className="column-title">Done (Loading...)</h2></div>
        </div>
    );
  }

  // Render DND context and columns on client
  console.log("KanbanBoard: Rendering DragDropContext (client is true).");
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="kanban-board">
        <Column droppableId="Deleted" title="Deleted" cards={deletedCards} />
        <Column droppableId="Active" title="Active" cards={activeCards} />
        <Column droppableId="Done" title="Done" cards={doneCards} />
      </div>
    </DragDropContext>
  );
  // --- End Render Logic ---
}
