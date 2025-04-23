'use client';

import { useState, useEffect } from 'react';
import Input from './components/Input';
import KanbanBoard from './components/KanbanBoard';
import AuthButtons from './components/AuthButtons';
import { Card, CardStatus } from './types/card';
import { updateCardStatus, getCards } from './actions';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';

/**
 * Home page component
 * Displays a Kanban board for task management and provides ability to add new tasks
 * 
 * @returns JSX.Element
 */
export default function HomePage(): JSX.Element {
  // State for cards, loading, and errors
  const [cards, setCards] = useState<Card[]>([]);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  
  // Load cards from database on component mount and when session changes
  useEffect(() => {
    async function loadCards() {
      try {
        setIsLoading(true);
        const cardsFromDB = await getCards();
        setCards(cardsFromDB);
        setError(null);
      } catch (err) {
        console.error('Failed to load cards:', err);
        setError('Failed to load cards. Please refresh the page.');
        toast.error('Failed to load cards');
      } finally {
        setIsLoading(false);
      }
    }
    
    if (status === 'authenticated') {
      loadCards();
    } else if (status === 'unauthenticated') {
      // Clear cards and loading state if user signs out
      setCards([]);
      setIsLoading(false);
      setError(null);
    }
  }, [status]); // Rerun effect when session status changes
  
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
      
      
      // Update card status via server action
      await updateCardStatus(card.id, nextStatus);
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
  
  /**
   * Handler for drag-and-drop card updates
   * @param updatedCard - The card with updated status and/or order
   */
  const handleCardUpdate = async (updatedCard: Card): Promise<void> => {
    // Skip if no status change
    if (!updatedCard.status) {
      return;
    }
    
    try {
      // Optimistically update UI state first for better UX
      setCards(prevCards => {
        // Find the card to update
        const updatedCards = prevCards.map(card => 
          card.id === updatedCard.id ? { ...card, ...updatedCard } : card
        );
        
        
        // Sort cards by order within each status group
        return updatedCards.sort((a, b) => {
          const aStatus = a.status || 'TODO';
          const bStatus = b.status || 'TODO';
          
          // First sort by status column order (TODO, IN_PROGRESS, DONE)
          if (aStatus !== bStatus) {
            const statusOrder = { 'TODO': 0, 'IN_PROGRESS': 1, 'DONE': 2 };
            return statusOrder[aStatus] - statusOrder[bStatus];
          }
          
          // Then by order within the same status
          const aOrder = a.order ?? 0;
          const bOrder = b.order ?? 0;
          return aOrder - bOrder;
        });
      });
      
      setIsUpdating(true);
      
      // Update card via server action
      await updateCardStatus(updatedCard.id, updatedCard.status, updatedCard.order);
      
      // Show success notification
      toast.success(`Card moved to ${updatedCard.status}`);
    } catch (error) {
      console.error('Failed to update card via drag and drop:', error);
      
      // Revert the change in state
      // Revert the change in state to the previous version
      setCards(prevCards => {
        // Find the original card from previous state
        const originalCard = prevCards.find(c => c.id === updatedCard.id);
        if (!originalCard) return prevCards;
        
        // Remove any optimistic updates
        return prevCards.map(card => 
          card.id === updatedCard.id ? originalCard : card
        );
      });
      // Show error notification
      toast.error('Failed to update card. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-6">
      <div className="w-full max-w-6xl">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-center">Task Manager</h1>
          <AuthButtons />
        </header>
        
        {/* Show loading state while checking session */}
        {status === 'loading' && (
          <div className="text-center text-gray-500">Authenticating...</div>
        )}
        
        {/* Show login prompt if unauthenticated */}
        {status === 'unauthenticated' && (
          <div className="text-center p-10 border rounded-lg bg-gray-50">
            <p className="mb-4 text-lg">Please sign in to manage your tasks.</p>
            <AuthButtons />
          </div>
        )}
        
        {/* Show Kanban board if authenticated */}
        {status === 'authenticated' && (
          <>
            {/* Input component for adding new tasks */}
            <div className="mb-6">
              <Input onCardCreated={handleCardCreated} />
            </div>
        
        {/* Error state */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Reload Page
            </button>
          </div>
        )}
        
        {/* Kanban board with all cards */}
        <div className="h-[calc(100vh-250px)]">
          <KanbanBoard 
            cards={cards}
            isLoading={isUpdating || isLoading}
            onCardClick={handleCardClick}
            onCardUpdate={handleCardUpdate}
          />
        </div>
        </>
      )}
      </div>
    </main>
  );
}
