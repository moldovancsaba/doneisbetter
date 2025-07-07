'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { VotePhase } from '@/components/VotePhase';
import { SwipePhase } from '@/components/SwipePhase';
import { withNavigationGuard } from '@/components/hoc/withNavigationGuard';

import type { Card } from '@/types/card';

type Phase = 'swipe' | 'vote';

/**
 * PlayPage Component
 * 
 * Manages the game flow between Swipe and Vote phases.
 * - Swipe Phase: Users swipe cards left/right to indicate like/dislike
 * - Vote Phase: Compare liked cards to establish ranking
 */
function PlayPage({ isRouteGuarded }: { isRouteGuarded?: boolean }) {
  const router = useRouter();
  
  // State Management
  const [phase, setPhase] = useState<Phase>('swipe');
  const [cards, setCards] = useState<Card[]>([]);
  const [likedCards, setLikedCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add notification when navigation is blocked
  useEffect(() => {
    if (isRouteGuarded) {
      toast.warning('Please finish reviewing all cards before viewing rankings');
    }
  }, [isRouteGuarded]);

  // Fetch and manage cards
  useEffect(() => {
    const loadCards = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // First check if we have any unswiped cards
        const availabilityResponse = await fetch('/api/cards/hasUnswiped');
        if (!availabilityResponse.ok) throw new Error('Failed to check card availability');
        const availabilityData = await availabilityResponse.json();
        
        // Commenting out redirection to help debug card loading
        // if (!availabilityData.hasUnswiped) {
        //   router.push('/ranking');
        //   return;
        // }

        // If we have cards, fetch them
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

    loadCards();
  }, [router]);

  // Handle left swipe (dislike)
  const handleLeftSwipe = useCallback((card: Card) => {
    setCards(prev => prev.slice(1));
  }, []);

  // Handle right swipe (like)
  const handleRightSwipe = useCallback((card: Card) => {
    // Add card to liked cards
    setLikedCards(prev => {
      const newLikedCards = [...prev, card];
      // If we have 2 or more liked cards, enter vote phase
      if (newLikedCards.length > 1) {
        setPhase('vote');
      }
      return newLikedCards;
    });
    setCards(prev => prev.slice(1));
  }, []);

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

  // Only render phase components if we have cards available
  if (phase === 'swipe' && cards.length === 0) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="h-full w-full flex items-center justify-center bg-gray-800">
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
  );
}

export default withNavigationGuard(PlayPage);
