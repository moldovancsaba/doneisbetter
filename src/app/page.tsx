'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import Input from './components/Input';
import KanbanBoard from './components/KanbanBoard';
import AuthButtons from './components/AuthButtons';
import { Card, CardStatus } from './types/card';
import { updateCardStatus, getCards, getAllCards, getDeletedCards, softDeleteCard } from '@/lib/actions';
import { useRouter, useSearchParams } from 'next/navigation';

// Define view modes
type ViewMode = 'myCards' | 'allCards' | 'deleted';

export default function Home() {
  // Component State
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('myCards');

  // Hooks
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Effect to update view mode from URL search params
  useEffect(() => {
    const mode = searchParams?.get('view') as ViewMode | null;
    if (mode && ['myCards', 'allCards', 'deleted'].includes(mode)) {
      setViewMode(mode);
    } else {
      setViewMode('myCards'); // Default to 'myCards' if param is invalid or missing
    }
  }, [searchParams]);
  
  // Effect to load cards based on session status and view mode
  useEffect(() => {
    const loadCards = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let fetchedCards: Card[] = [];
        if (!session?.user?.id) {
          throw new Error("User session not found.");
        }
        
        switch (viewMode) {
          case 'allCards':
            // Add proper authorization check if needed before calling getAllCards
            fetchedCards = await getAllCards();
            break;
          case 'deleted':
            fetchedCards = await getDeletedCards(session.user.id);
            break;
          default: // 'myCards'
            fetchedCards = await getCards(session.user.id);
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

    if (status === 'authenticated') {
      loadCards();
    } else if (status === 'unauthenticated') {
      setCards([]);
      setIsLoading(false);
      setError(null);
    }
  }, [status, viewMode, session]); // Add session to dependency array

  // Update URL when view mode changes
  const handleViewChange = (newMode: ViewMode) => {
    setViewMode(newMode);
    router.push(`/?view=${newMode}`, { scroll: false });
  };

  // Card Handlers (kept similar to original logic)
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
    
    if (!session?.user?.id) {
      toast.error('Authentication error');
      return;
    }

    setIsUpdating(true);
    try {
      await updateCardStatus(card.id, nextStatus, session.user.id); // Pass userId
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
    if (!updatedCard.status || !session?.user?.id) return;
    const originalCards = [...cards];

    setCards(prevCards => {
        const updated = prevCards.map(c => c.id === updatedCard.id ? {...c, ...updatedCard} : c);
        // You might need a more robust sorting logic here depending on requirements
        return updated.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    });
    
    setIsUpdating(true);
    try {
      await updateCardStatus(updatedCard.id, updatedCard.status, session.user.id, updatedCard.order); 
    } catch (error) {
      console.error('Failed to update card via drag and drop:', error);
      setCards(originalCards);
      toast.error('Failed to update card position.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCardDelete = async (cardId: string): Promise<void> => {
    if (!session?.user?.id) return;
    const originalCards = [...cards];
    setCards(prev => prev.filter(c => c.id !== cardId)); 
    const toastId = toast.loading('Deleting card...');

    try {
      // Assuming softDeleteCard now just needs cardId and infers user from session
      await softDeleteCard(cardId, session.user.id); 
      toast.success('Card moved to deleted', { id: toastId });
      // Refetch might be better if deleted view needs immediate update elsewhere
    } catch (error) {
      setCards(originalCards); 
      console.error('Error deleting card:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete card', { id: toastId });
    }
  };

  // Render Logic
  if (status === 'loading') {
    return <div className="text-center text-gray-500 py-10">Authenticating...</div>;
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center">Done Is Better</h1>
          <p className="text-center text-gray-600">Please sign in to continue</p>
          {/* AuthButtons might need context, place it inside client component scope */}
          <AuthButtons /> 
        </div>
      </div>
    );
  }

  // Authenticated User View
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-6">
      <div className="w-full max-w-6xl">
         {/* Header is now in layout.tsx, no need to repeat */}
         <div className="mb-6 flex justify-end">
           {/* View Mode Toggles */}
           <div className="flex space-x-2 border border-gray-300 rounded p-1">
              <button
                onClick={() => handleViewChange('myCards')}
                disabled={viewMode === 'myCards'}
                className={`px-3 py-1 text-sm rounded ${viewMode === 'myCards' ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100'}`}
                aria-pressed={viewMode === 'myCards'}
              >My Cards</button>
              <button
                onClick={() => handleViewChange('allCards')}
                disabled={viewMode === 'allCards'}
                className={`px-3 py-1 text-sm rounded ${viewMode === 'allCards' ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100'}`}
                aria-pressed={viewMode === 'allCards'}
              >All Cards</button>
              <button
                onClick={() => handleViewChange('deleted')}
                disabled={viewMode === 'deleted'}
                className={`px-3 py-1 text-sm rounded ${viewMode === 'deleted' ? 'bg-red-600 text-white' : 'bg-white hover:bg-gray-100'}`}
                aria-pressed={viewMode === 'deleted'}
              >Deleted</button>
            </div>
         </div>

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

         <div className="h-[calc(100vh-250px)]"> 
              <KanbanBoard
                cards={cards}
                isLoading={isLoading || isUpdating} // Combine loading states
                isReadOnly={viewMode !== 'myCards'} 
                onCardClick={viewMode === 'myCards' ? handleCardClick : undefined} 
                onCardUpdate={viewMode === 'myCards' ? handleCardUpdate : undefined} 
                onCardDelete={viewMode === 'myCards' ? handleCardDelete : undefined} 
              />
         </div>
      </div> 
    </main> 
  ); 
}
