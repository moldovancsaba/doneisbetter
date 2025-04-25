// src/app/components/HomePageClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import Input from './Input';
import KanbanBoard from './KanbanBoard';
import { Card, CardStatus } from '../types/card';
import { updateCardStatus, getCards, getDeletedCards, softDeleteCard } from '@/lib/actions';

type ViewMode = 'myCards' | 'allCards' | 'deleted';

export default function HomePageClient() {
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('myCards');

  const { data: session, status } = useSession({ required: true });
  const searchParams = useSearchParams();
  const router = useRouter();

  // Effect to set view mode based on URL
  useEffect(() => {
    const mode = searchParams?.get('view') as ViewMode | null;
    if (mode && ['myCards', 'allCards', 'deleted'].includes(mode)) {
      if (mode === 'allCards' && session?.user?.role !== 'admin') {
        setViewMode('myCards');
        router.push(`/?view=myCards`, { scroll: false });
      } else {
        if (viewMode !== mode) setViewMode(mode);
      }
    } else {
      if (viewMode !== 'myCards') setViewMode('myCards');
    }
  }, [searchParams, session, router, viewMode]);

  // Effect to load cards
  useEffect(() => {
    const loadCards = async () => {
      setIsLoading(true);
      setError(null);
      let fetchedCards: Card[] = [];
      try {
        if (!session?.user?.id) throw new Error("User session not found.");

        switch (viewMode) {
          case 'allCards':
            if (session.user.role !== 'admin') throw new Error("Unauthorized");
            fetchedCards = await getCards();
            break;
          case 'deleted':
            fetchedCards = await getDeletedCards(session.user.id);
            break;
          default: // 'myCards'
            fetchedCards = await getCards(session.user.id); // Pass userId
            break;
        }

        const transformedCards = fetchedCards.map(card => ({
          id: card.id || `fallback-id-${Math.random()}`,
          content: card.content || 'No Content Provided',
          status: (card.status as CardStatus) || 'TODO',
          order: typeof card.order === 'number' ? card.order : 0,
          createdAt: card.createdAt || new Date().toISOString(),
          userName: card.userName || (viewMode === 'allCards' ? 'Unknown User' : undefined),
          userImage: card.userImage || undefined
        }));
        setCards(transformedCards);

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load cards';
        console.error('Failed to load cards:', err);
        setError(errorMessage + '. Please refresh.');
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (status === 'authenticated' && session?.user?.id) {
      loadCards();
    }
  }, [viewMode, session, status]);

  const handleViewChange = (newMode: ViewMode) => {
    if (newMode === 'allCards' && session?.user?.role !== 'admin') {
      toast.error("Admin access required.");
      return;
    }
    router.push(`/?view=${newMode}`, { scroll: false });
  };

  const handleCardCreated = (newCard: Card): void => {
    if (viewMode === 'myCards') {
      setCards(prevCards => [newCard, ...prevCards].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
    }
    toast.success('Card created!');
  };

  const handleCardClick = async (card: Card): Promise<void> => {
    if (!session?.user?.id) return;
    let nextStatus: CardStatus;
    switch (card.status) {
      case 'TODO': nextStatus = 'IN_PROGRESS'; break;
      case 'IN_PROGRESS': nextStatus = 'DONE'; break;
      default: return;
    }
    setIsUpdating(true);
    const originalCards = [...cards];
    setCards(prevCards => prevCards.map(c => c.id === card.id ? { ...c, status: nextStatus } : c));
    try {
      await updateCardStatus(card.id, nextStatus, session.user.id);
      toast.success(`Card moved to ${nextStatus}`);
    } catch (error) {
      console.error('Failed to update card status:', error);
      toast.error('Failed to move card.');
      setCards(originalCards);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCardUpdate = async (updatedCard: Card): Promise<void> => {
    if (!updatedCard.status || !session?.user?.id) return;
    const originalCards = [...cards];
    setCards(prevCards => prevCards.map(c => c.id === updatedCard.id ? { ...c, ...updatedCard } : c).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
    setIsUpdating(true);
    try {
      await updateCardStatus(updatedCard.id, updatedCard.status, session.user.id, updatedCard.order);
    } catch (error) {
      console.error('Failed to update card via DND:', error);
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
    const toastId = toast.loading('Deleting...');
    try {
      await softDeleteCard(cardId, session.user.id);
      toast.success('Card deleted', { id: toastId });
    } catch (error) {
      setCards(originalCards);
      console.error('Error deleting card:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete', { id: toastId });
    }
  };

  return (
    <>
      <div className="mb-6 flex justify-end">
        <div className="flex space-x-2 border border-gray-300 rounded p-1">
          <button onClick={() => handleViewChange('myCards')} disabled={viewMode === 'myCards'} className={`px-3 py-1 text-sm rounded ${viewMode === 'myCards' ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100'}`} aria-pressed={viewMode === 'myCards'}>My Cards</button>
          {session?.user?.role === 'admin' && (
            <button onClick={() => handleViewChange('allCards')} disabled={viewMode === 'allCards'} className={`px-3 py-1 text-sm rounded ${viewMode === 'allCards' ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100'}`} aria-pressed={viewMode === 'allCards'}>All Cards</button>
          )}
          <button onClick={() => handleViewChange('deleted')} disabled={viewMode === 'deleted'} className={`px-3 py-1 text-sm rounded ${viewMode === 'deleted' ? 'bg-red-600 text-white' : 'bg-white hover:bg-gray-100'}`} aria-pressed={viewMode === 'deleted'}>Deleted</button>
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
        </div>
      )}

      <div className="h-[calc(100vh-250px)]"> {/* Adjust height as needed */}
        <KanbanBoard
          cards={cards}
          isLoading={isLoading || isUpdating}
          isReadOnly={viewMode !== 'myCards'}
          onCardClick={viewMode === 'myCards' ? handleCardClick : undefined}
          onCardUpdate={viewMode === 'myCards' ? handleCardUpdate : undefined}
          onCardDelete={viewMode === 'myCards' ? handleCardDelete : undefined}
        />
    </>
);
