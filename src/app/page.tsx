'use client';

import { useState } from 'react';
import { initialCards } from "./lib/data";
import Input from './components/Input';
import KanbanBoard from './components/KanbanBoard';
import { Card, CardStatus } from './types/card';
import { updateCardStatus } from './actions';

/**
 * Home page component
 * Displays a Kanban board for task management and provides ability to add new tasks
 * 
 * @returns JSX.Element
 */
export default function HomePage(): JSX.Element {
  // Initialize state with the default cards
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  
  /**
   * Handler for adding a new card to the board
   * @param newCard - The newly created card from the Input component
   */
  const handleCardCreated = (newCard: Card): void => {
    setCards(prevCards => [newCard, ...prevCards]);
  };
  
  /**
   * Handler for card click - moves the card to the next status
   * @param card - The card that was clicked
   */
  const handleCardClick = async (card: Card): Promise<void> => {
    // Determine the next status in the workflow
    let nextStatus: CardStatus;
    
    switch (card.status) {
      case 'TODO':
        nextStatus = 'IN_PROGRESS';
        break;
      case 'IN_PROGRESS':
        nextStatus = 'DONE';
        break;
      case 'DONE':
        return; // No next status for DONE cards
      default:
        nextStatus = 'IN_PROGRESS'; // Default for cards without status
    }
    
    try {
      setIsUpdating(true);
      
      // In a real app, this would call the server action to update the card in the database
      // await updateCardStatus(card.id, nextStatus);
      
      // Update the card in our local state
      setCards(prevCards => 
        prevCards.map(c => 
          c.id === card.id ? { ...c, status: nextStatus } : c
        )
      );
    } catch (error) {
      console.error('Failed to update card status:', error);
      // In a real app, we'd show an error toast or notification
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-6">
      <div className="w-full max-w-6xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Task Manager</h1>
        
        {/* Input component for adding new tasks */}
        <div className="mb-6">
          <Input onCardCreated={handleCardCreated} />
        </div>
        
        {/* Kanban board with all cards */}
        <div className="h-[calc(100vh-250px)]">
          <KanbanBoard 
            cards={cards}
            isLoading={isUpdating}
            onCardClick={handleCardClick}
          />
        </div>
      </div>
    </main>
  );
}
