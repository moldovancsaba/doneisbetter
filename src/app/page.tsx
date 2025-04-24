'use client';

import { useState, useEffect } from 'react';
import Input from './components/Input';
import KanbanBoard from './components/KanbanBoard';
import AuthButtons from './components/AuthButtons';
import { Card, CardStatus } from './types/card';
import { updateCardStatus, getCards, getDeletedCards, softDeleteCard } from '@/lib/actions'; 
import { getAllCards } from '@/lib/actions'; 
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';

/**
 * Home page component
 * Displays a Kanban board for task management and provides ability to add new tasks
 * 
 * @returns JSX.Element
 */
export default function HomePage(): JSX.Element {
  // State for cards, loading, errors, and view mode
  const [cards, setCards] = useState<Card[]>([]);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const [viewMode, setViewMode] = useState<'myCards' | 'allCards' | 'deleted'>('myCards');
  
  // Load cards from database on component mount and when session/viewMode changes
  useEffect(() => {
    async function loadCards() {
      try {
        setIsLoading(true);
        // Fetch cards based on view mode
        let cardsFromDB: Card[];
        if (viewMode === 'deleted') {
          cardsFromDB = await getDeletedCards();
        } else if (viewMode === 'myCards') {
          cardsFromDB = await getCards();
        } else { // viewMode === 'allCards'
          cardsFromDB = await getAllCards();
        }
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
  }, [status, viewMode]); 
  
  /**
   * Handler for adding a new card to the board
   * @param newCard - The newly created card from the Input component
   */
  const handleCardCreated = (newCard: Card): void => {
    // Only add to view if in 'My Cards' mode initially
    if (viewMode === 'myCards') {
       setCards(prevCards => [newCard, ...prevCards]);
    }
     // Optionally show toast regardless of view
     toast.success('Card created successfully!');
  };
  
  /**
   * Handler for card click - moves the card to the next status
   * @param card - The card that was clicked
   */
  const handleCardClick = async (card: Card): Promise<void> => {
    let nextStatus: CardStatus;
    
    switch (card.status) {
      case 'TODO': nextStatus = 'IN_PROGRESS'; break;
      case 'IN_PROGRESS': nextStatus = 'DONE'; break;
      case 'DONE': return; 
      default: nextStatus = 'IN_PROGRESS'; 
    }
    
    try {
      setIsUpdating(true);
      await updateCardStatus(card.id, nextStatus);
      setCards(prevCards => 
        prevCards.map(c => 
          c.id === card.id ? { ...c, status: nextStatus } : c
        )
      );
      toast.success(`Card moved to ${nextStatus}`);
    } catch (error) {
      console.error('Failed to update card status:', error);
      toast.error('Failed to move card.');
    } finally {
      setIsUpdating(false);
    }
  };
  
  /**
   * Handler for drag-and-drop card updates
   * @param updatedCard - The card with updated status and/or order
   */
  const handleCardUpdate = async (updatedCard: Card): Promise<void> => {
    if (!updatedCard.status) return;
    const originalCards = [...cards]; // Snapshot for potential revert

    try {
      // Optimistic UI update
      setCards(prevCards => {
        const updatedCards = prevCards.map(card => 
          card.id === updatedCard.id ? { ...card, ...updatedCard } : card
        );
        return updatedCards.sort((a, b) => { // Keep sorted
          const aStatus = a.status || 'TODO';
          const bStatus = b.status || 'TODO';
          if (aStatus !== bStatus) {
            const statusOrder = { 'TODO': 0, 'IN_PROGRESS': 1, 'DONE': 2 };
            return statusOrder[aStatus] - statusOrder[bStatus];
          }
          const aOrder = a.order ?? 0;
          const bOrder = b.order ?? 0;
          return aOrder - bOrder;
        });
      });
      
      setIsUpdating(true);
      // Call server action
      await updateCardStatus(updatedCard.id, updatedCard.status, updatedCard.order);
      // No success toast needed for drag-drop? Or maybe a subtle one.
      // toast.success(`Card moved to ${updatedCard.status}`); 
    } catch (error) {
      console.error('Failed to update card via drag and drop:', error);
      setCards(originalCards); // Revert optimistic update
      toast.error('Failed to update card position.');
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Handler for soft deleting a card
   * @param cardId - The ID of the card to delete
   */
  const handleCardDelete = async (cardId: string): Promise<void> => {
    const originalCards = [...cards];
    setCards(prev => prev.filter(c => c.id !== cardId)); // Optimistic UI update
    const toastId = toast.loading('Deleting card...');

    try {
      const result = await softDeleteCard(cardId); 
      if (result.success) {
        toast.success('Card deleted', { id: toastId });
      } else {
        setCards(originalCards); // Revert
        toast.error(result.message || 'Failed to delete card', { id: toastId });
      }
    } catch (error) {
      setCards(originalCards); // Revert
      console.error('Error deleting card:', error);
      toast.error('An unexpected error occurred while deleting.', { id: toastId });
    }
  };
  
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-6">
      <div className="w-full max-w-6xl">
        <header className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h1 className="text-3xl font-bold">Task Manager</h1>
          <div className="flex items-center space-x-4">
            {/* View Mode Toggle Buttons */}
            <div className="flex space-x-2 border border-gray-300 rounded p-1">
              <button
                onClick={() => setViewMode('myCards')}
                disabled={viewMode === 'myCards' || status !== 'authenticated'}
                className={`px-3 py-1 text-sm rounded ${
                  viewMode === 'myCards' 
                    ? 'bg-blue-600 text-white cursor-default' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
                aria-pressed={viewMode === 'myCards'}
              >
                My Cards
              </button>
              <button
                onClick={() => setViewMode('allCards')}
                disabled={viewMode === 'allCards' || status !== 'authenticated'}
                className={`px-3 py-1 text-sm rounded ${
                  viewMode === 'allCards' 
                    ? 'bg-blue-600 text-white cursor-default' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
                }`} 
                aria-pressed={viewMode === 'allCards'} 
              >
                All Cards
              </button>
              {/* Deleted View Button */}
              <button
                onClick={() => setViewMode('deleted')}
                disabled={viewMode === 'deleted' || status !== 'authenticated'}
                className={`px-3 py-1 text-sm rounded ${
                  viewMode === 'deleted' 
                    ? 'bg-red-600 text-white cursor-default' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
                 aria-pressed={viewMode === 'deleted'}
              >
                Deleted
              </button>
            </div> 
            <AuthButtons />
          </div> 
        </header> 
        
        {/* Loading state while checking session */}
        {status === 'loading' && (
          <div className="text-center text-gray-500 py-10">Authenticating...</div>
        )}
        
        {/* Login prompt if unauthenticated */}
        {status === 'unauthenticated' && (
          <div className="text-center p-10 border rounded-lg bg-gray-50">
            <p className="mb-4 text-lg">Please sign in to manage your tasks.</p>
            <AuthButtons />
          </div>
        )}
        
        {/* Main content if authenticated */}
        {status === 'authenticated' && (
          <> 
            {/* Input only for My Cards */}
            {viewMode === 'myCards' && ( 
              <div className="mb-6">
                <Input onCardCreated={handleCardCreated} />
              </div>
            )} 

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded" role="alert">
                <p>{error}</p>
                <button
                  onClick={() => window.location.reload()} 
                  className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Reload Page
                </button>
              </div>
            )}

            {/* Kanban Board */}
            <div className="h-[calc(100vh-250px)]"> 
              <KanbanBoard
                cards={cards}
                isLoading={isUpdating || isLoading}
                isReadOnly={viewMode !== 'myCards'} // Read-only if not 'My Cards'
                onCardClick={viewMode === 'myCards' ? handleCardClick : undefined} // Click only in 'My Cards'
                onCardUpdate={viewMode === 'myCards' ? handleCardUpdate : undefined} // Drag update only in 'My Cards'
                onCardDelete={viewMode === 'myCards' ? handleCardDelete : undefined} // Delete only in 'My Cards'
              />
            </div>
          </> 
        )} 
      </div> 
    </main> 
  ); 
}
