'use client';

import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import Column from './Column';
import { updateCardStatus, updateCardsOrder } from '@/app/actions';
import { Card } from '@/app/page';

// Column ID type
type ColumnId = 'Active' | 'Done' | 'Deleted' | 'Decide';

// Card status type
type CardStatus = 'active' | 'done' | 'deleted' | 'decide';

// Props interface
interface KanbanBoardProps {
  initialCards: Card[];
}

// List info return type
interface ListInfo {
  list: Card[];
  setter: Dispatch<SetStateAction<Card[]>>;
}

export default function KanbanBoard({ initialCards }: KanbanBoardProps) {
  // State
  const [activeCards, setActiveCards] = useState<Card[]>([]);
  const [doneCards, setDoneCards] = useState<Card[]>([]);
  const [deletedCards, setDeletedCards] = useState<Card[]>([]);
  const [decideCards, setDecideCards] = useState<Card[]>([]);
  const [isClient, setIsClient] = useState<boolean>(false);

  // Helper Functions
  const getListInfo = (statusId: string): ListInfo => {
    switch (statusId) {
      case 'Active': return { list: activeCards, setter: setActiveCards };
      case 'Done': return { list: doneCards, setter: setDoneCards };
      case 'Deleted': return { list: deletedCards, setter: setDeletedCards };
      case 'Decide': return { list: decideCards, setter: setDecideCards };
      default: return { 
        list: [], 
        setter: () => console.warn(`getListInfo: Setter not found for statusId: ${statusId}`) 
      };
    }
  };

  // Maps column ID to status string
  const mapIdToStatus = (id: string): CardStatus => {
    if (id === 'Deleted') return 'deleted';
    if (id === 'Done') return 'done';
    if (id === 'Decide') return 'decide';
    return 'active'; // Default
  };

  // Finds the current column ID for a card
  const findColumnId = (cardId: string): ColumnId | null => {
    if (activeCards.some(c => c.id === cardId)) return 'Active';
    if (doneCards.some(c => c.id === cardId)) return 'Done';
    if (deletedCards.some(c => c.id === cardId)) return 'Deleted';
    if (decideCards.some(c => c.id === cardId)) return 'Decide';
    return null;
  };

  // Reversal logic for optimistic updates failure
  const handleStateReversal = (
    cardId: string, 
    originalColumnId: string,
    sourceListBeforeMove: Card[], 
    destListBeforeMove: Card[]
  ): void => {
    console.log(`Attempting state reversal for ${cardId} back to ${originalColumnId}`);
    
    const { setter: setSourceList } = getListInfo(originalColumnId);
    const currentDestColId = findColumnId(cardId);
    
    if (!currentDestColId) {
      console.error(`Card ${cardId} not found in any column during reversal`);
      return;
    }
    
    const { setter: setDestList } = getListInfo(currentDestColId);

    // Reset both lists to their state before the optimistic update
    setSourceList(sourceListBeforeMove);
    
    // Only reset destList if it's different from sourceList
    if (originalColumnId !== currentDestColId) {
      setDestList(destListBeforeMove);
    }

    alert(`Failed to save change. Card reverted.`);
    console.log(`Visually reverted card ${cardId}`);
  };

  // Initialize state from props after client mount or if props change
  useEffect(() => {
    setIsClient(true);
    
    const cards = Array.isArray(initialCards) ? initialCards : [];
    setActiveCards(cards.filter(card => card.status === 'active'));
    setDoneCards(cards.filter(card => card.status === 'done'));
    setDeletedCards(cards.filter(card => card.status === 'deleted'));
    setDecideCards(cards.filter(card => card.status === 'decide'));
  }, [initialCards]);

  // Drag End Handler
  const onDragEnd = (result: DropResult): void => {
    const { source, destination, draggableId } = result;

    // Check if dropped outside a valid area
    if (!destination) {
      return;
    }

    const sourceColId = source.droppableId;
    const destColId = destination.droppableId;
    const sourceIndex = source.index;
    const destIndex = destination.index;
    const cardId = draggableId;

    // Check if dropped in the same place
    if (sourceColId === destColId && sourceIndex === destIndex) {
      return;
    }

    // Get state before move for potential reversal
    const sourceListBeforeMove = [...getListInfo(sourceColId).list];
    const destListBeforeMove = [...getListInfo(destColId).list];

    // Find the card being moved
    const { list: sourceList, setter: setSourceList } = getListInfo(sourceColId);
    const cardToMove = sourceList[sourceIndex];

    if (!cardToMove || cardToMove.id !== cardId) {
      console.error(`Card mismatch! draggableId ${cardId} not found at index ${sourceIndex} in ${sourceColId}.`);
      return;
    }

    // Optimistic Update: Remove from source list
    const newSourceList = Array.from(sourceList);
    newSourceList.splice(sourceIndex, 1);

    // CASE A: SAME COLUMN REORDER
    if (sourceColId === destColId) {
      // Insert into new position in the modified source list
      newSourceList.splice(destIndex, 0, cardToMove);
      setSourceList(newSourceList);

      // Persist Order
      const orderUpdates = newSourceList.map((card, index) => ({ 
        id: card.id, 
        order: index 
      }));
      
      updateCardsOrder(orderUpdates)
        .then(res => {
          if (!res.success) {
            console.error("Failed order save:", res.error);
            handleStateReversal(cardId, sourceColId, sourceListBeforeMove, destListBeforeMove);
          }
        })
        .catch(err => {
          console.error("Network error saving order:", err);
          handleStateReversal(cardId, sourceColId, sourceListBeforeMove, destListBeforeMove);
        });
    } 
    // CASE B: DIFFERENT COLUMN MOVE
    else {
      const { list: destList, setter: setDestList } = getListInfo(destColId);
      
      // Create new list for destination
      const newDestList = Array.from(destList);
      newDestList.splice(destIndex, 0, cardToMove);

      // Update state for both columns optimistically
      setSourceList(newSourceList);
      setDestList(newDestList);

      // Persist Status Change
      const newStatus = mapIdToStatus(destColId);
      
      updateCardStatus(cardId, newStatus)
        .then(res => {
          if (!res.success) {
            console.error("Failed status save:", res.error);
            handleStateReversal(cardId, sourceColId, sourceListBeforeMove, destListBeforeMove);
          }
        })
        .catch(err => {
          console.error("Network error saving status:", err);
          handleStateReversal(cardId, sourceColId, sourceListBeforeMove, destListBeforeMove);
        });
    }
  };

  // Render placeholder if not client-side yet
  if (!isClient) {
    return (
      <div className="kanban-board kanban-grid" aria-busy="true" role="region" aria-label="Loading Kanban board">
        <div className="grid-row">
          <div className="kanban-column"><h2 className="column-title">DO (Loading...)</h2></div>
          <div className="kanban-column"><h2 className="column-title">DECIDE (Loading...)</h2></div>
        </div>
        <div className="grid-row">
          <div className="kanban-column"><h2 className="column-title">DELEGATE (Loading...)</h2></div>
          <div className="kanban-column"><h2 className="column-title">DELETE (Loading...)</h2></div>
        </div>
      </div>
    );
  }

  // Render DND context and columns on client
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="kanban-board kanban-grid" role="region" aria-label="Eisenhower Matrix Kanban board">
        <div className="grid-row">
          <Column droppableId="Active" title="DO" cards={activeCards} />
          <Column droppableId="Decide" title="DECIDE" cards={decideCards} />
        </div>
        <div className="grid-row">
          <Column droppableId="Deleted" title="DELEGATE" cards={deletedCards} />
          <Column droppableId="Done" title="DELETE" cards={doneCards} />
        </div>
      </div>
    </DragDropContext>
  );
}

