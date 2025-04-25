'use client';

import { useState, useEffect } from 'react';
// Removed useSession import
import toast from 'react-hot-toast';
import Input from './components/Input';
import KanbanBoard from './components/KanbanBoard';
// Removed AuthButtons import
import { Card, CardStatus } from './types/card';
// Simplified actions import (will update actions next)
import { updateCardStatus, getCards, getDeletedCards, softDeleteCard } from '@/lib/actions';
import { useRouter, useSearchParams } from 'next/navigation';

// Simpler view modes - removed 'allCards'
type ViewMode = 'myCards' | 'deleted';

export default function Home() {
  // Component State
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Default view mode
  const [viewMode, setViewMode] = useState<ViewMode>('myCards');

  // Hooks
  const searchParams = useSearchParams();
  const router = useRouter();

  // Effect to update view mode from URL search params (simplified)
  useEffect(() => {
    const mode = searchParams?.get('view') as ViewMode | null;
    if (mode && ['myCards', 'deleted'].includes(mode)) {
      setViewMode(mode);
    } else {
      setViewMode('myCards');
    }
  }, [searchParams]);

  // Effect to load cards based on view mode (removed session dependency)
  useEffect(() => {
    const loadCards = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let fetchedCards: Card[] = [];
        // Hardcoded/placeholder user ID - Replace with actual logic if needed later
        const placeholderUserId = "placeholder-user-id";

        switch (viewMode) {
          case 'deleted':
            fetchedCards = await getDeletedCards(placeholderUserId); // Needs user ID
            break;
          default: // 'myCards'
            fetchedCards = await getCards(placeholderUserId); // Needs user ID
            break;
        }
        setCards(fetchedCards);
      } catch (err) {
        console.error('Failed to load cards:', err);
        setError('Failed to load cards. Please refresh the page.');
        toast.error('Failed to load cards');
      } finally {
        setIsLoading(false);
      }
    };

    loadCards(); // Load cards directly
  }, [viewMode]); // Re-run only when viewMode changes

  // Update URL when view mode changes (simplified)
  const handleViewChange = (newMode: ViewMode) => {
    setViewMode(newMode);
    router.push(`/?view=${newMode}`, { scroll: false });
  };

  // Card Handlers (Removed session checks, using placeholder user ID)
  const placeholderUserId = "placeholder-user-id"; // Use consistent placeholder

  const handleCardCreated = (newCard: Card): void => {
    if (viewMode === 'myCards') {
      setCards(prevCards => [newCard, ...prevCards]);
    }
    toast.success('Card created successfully!');
  };

  const handleCardClick = async (card: Card): Promise<void> => {
    let nextStatus: CardStatus;
    switch (card.status) {
      case 'TODO': nextStatus = 'IN_PROGRESS'; break;
      case 'IN_PROGRESS': nextStatus = 'DONE'; break;
      case 'DONE': return;
      default: nextStatus = 'IN_PROGRESS';
    }

    setIsUpdating(true);
    try {
      // Pass placeholder user ID
      await updateCardStatus(card.id, nextStatus, placeholderUserId);
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

  const handleCardUpdate = async (updatedCard: Card): Promise<void> => {
    if (!updatedCard.status) return;
    const originalCards = [...cards];

    setCards(prevCards => {
      const updated = prevCards.map(c => c.id === updatedCard.id ? {...c, ...updatedCard} : c);
      return updated.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    });

    setIsUpdating(true);
    try {
      // Pass placeholder user ID
      await updateCardStatus(updatedCard.id, updatedCard.status, placeholderUserId, updatedCard.order);
    } catch (error) {
      console.error('Failed to update card via drag and drop:', error);
      setCards(originalCards);
      toast.error('Failed to update card position.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCardDelete = async (cardId: string): Promise<void> => {
    const originalCards = [...cards];
    setCards(prev => prev.filter(c => c.id !== cardId));
    const toastId = toast.loading('Deleting card...');

    try {
      // Pass placeholder user ID
      await softDeleteCard(cardId, placeholderUserId);
      toast.success('Card moved to deleted', { id: toastId });
    } catch (error) {
      setCards(originalCards);
      console.error('Error deleting card:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete card', { id: toastId });
    }
  };

  // Simplified Render Logic (Always shows authenticated view content)
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-6">
      <div className="w-full max-w-6xl">
        {/* Removed Header / Admin Link */}
        <div className="mb-6 flex justify-between items-center">
           <h1 className="text-2xl font-bold">Done Is Better</h1>
           {/* Simplified View Mode Toggles */}
           <div className="flex space-x-2 border border-gray-300 rounded p-1">
             <button
               onClick={() => handleViewChange('myCards')}
               disabled={viewMode === 'myCards'}
               className={`px-3 py-1 text-sm rounded ${viewMode === 'myCards' ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100'}`}
               aria-pressed={viewMode === 'myCards'}
             >My Cards</button>
             {/* Removed 'All Cards' button */}
             <button
               onClick={() => handleViewChange('deleted')}
               disabled={viewMode === 'deleted'}
               className={`px-3 py-1 text-sm rounded ${viewMode === 'deleted' ? 'bg-red-600 text-white' : 'bg-white hover:bg-gray-100'}`}
               aria-pressed={viewMode === 'deleted'}
             >Deleted</button>
           </div>
         </div>


        {/* Always show input if in 'myCards' view */}
        {viewMode === 'myCards' && (
          <div className="mb-6">
            <Input onCardCreated={handleCardCreated} />
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded" role="alert">
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Reload Page</button>
          </div>
        )}

        <div className="h-[calc(100vh-200px)]"> {/* Adjusted height */}
          <KanbanBoard
            cards={cards}
            isLoading={isLoading || isUpdating}
            // Simplified readOnly logic
            isReadOnly={viewMode === 'deleted'}
            onCardClick={viewMode === 'myCards' ? handleCardClick : undefined}
            onCardUpdate={viewMode === 'myCards' ? handleCardUpdate : undefined}
            onCardDelete={viewMode === 'myCards' ? handleCardDelete : undefined}
          />
        </div>
      </div>
    </main>
  );
}
