'use client';

import { useCallback, useEffect, useState } from 'react';
import { VotePhase } from '@/components/VotePhase';
import { SwipePhase } from '@/components/SwipePhase';

import type { Card } from '@/types/card';

type Phase = 'swipe' | 'vote';

/**
 * PlayPage Component
 * 
 * Manages the game flow between Swipe and Vote phases.
 * - Swipe Phase: Users swipe cards left/right to indicate like/dislike
 * - Vote Phase: Compare liked cards to establish ranking
 */
export default function PlayPage() {
  // State Management
  const [phase, setPhase] = useState<Phase>('swipe');
  const [cards, setCards] = useState<Card[]>([]);
  const [likedCards, setLikedCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial cards
  useEffect(() => {
    const fetchCards = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/cards');
        if (!response.ok) throw new Error('Failed to fetch cards');
        
        const data = await response.json();
        const mappedCards = data.map((card: any) => ({
          _id: card._id || card.id,
          id: card._id || card.id,
          title: card.title,
          imageUrl: card.imageUrl,
          rank: card.rank || 1400,
        }));
        setCards(mappedCards);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch cards');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCards();
  }, []);

  // Handle left swipe (dislike)
  const handleLeftSwipe = useCallback((card: Card) => {
    setCards(prev => prev.slice(1));
  }, []);

  // Handle right swipe (like)
  const handleRightSwipe = useCallback((card: Card) => {
    // Add card to liked cards
    setLikedCards(prev => [...prev, card]);
    setCards(prev => prev.slice(1));

    // If we have 2 or more liked cards, enter vote phase
    if (likedCards.length > 0) {
      setPhase('vote');
    }
  }, [likedCards.length]);

  // Handle vote completion
  const handleVoteComplete = useCallback(() => {
    setPhase('swipe');
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">Error</p>
          <p className="mt-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-8 text-center">
            {phase === 'swipe' ? 'Choose Your Cards' : 'Compare Cards'}
          </h1>

          {phase === 'swipe' ? (
            <SwipePhase 
              cards={cards}
              onLeftSwipe={handleLeftSwipe}
              onRightSwipe={handleRightSwipe}
            />
          ) : (
            <VotePhase
              likedCards={likedCards}
              onVoteComplete={handleVoteComplete}
            />
          )}
        </div>
      </div>
    </div>
  );
}
