import React, { useState, useCallback, useEffect } from 'react';
import { CardSwipeContainer } from './CardSwipeContainer';
import { VoteComparison } from './VoteComparison';
import { getNextComparisonCard } from '../utils/rankingLogic';

interface Card {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  rank?: number;
}

type Phase = 'swipe' | 'vote';

/**
 * PlayPage Component
 * 
 * Manages the game flow between Swipe and Vote phases.
 * - Swipe Phase: Users swipe cards left/right
 * - Vote Phase: Activated when 2+ cards are liked
 */
export const PlayPage: React.FC = () => {
  // Phase state management
  const [phase, setPhase] = useState<Phase>('swipe');
  const [likedCards, setLikedCards] = useState<Card[]>([]);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [previousComparisons, setPreviousComparisons] = useState<Set<string>>(new Set());
  const [comparisonCard, setComparisonCard] = useState<Card | null>(null);

  // Watch likedCards and transition to vote phase when we have 2 or more
  useEffect(() => {
    if (likedCards.length >= 2 && phase === 'swipe') {
      // Get a comparison card for the most recently liked card
      const newCard = likedCards[likedCards.length - 1];
      const nextCard = getNextComparisonCard(newCard, likedCards.slice(0, -1));
      
      if (nextCard) {
        setComparisonCard(nextCard);
        setPhase('vote');
        setPreviousComparisons(new Set([nextCard._id]));
      }
    }
  }, [likedCards, phase]);

  // Fetch initial card
  useEffect(() => {
    const fetchInitialCard = async () => {
      try {
        // TODO: Replace with actual API call
        const response = await fetch('/api/cards/next');
        const card = await response.json();
        setCurrentCard(card);
      } catch (error) {
        console.error('Failed to fetch card:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialCard();
  }, []);

  // Handle card voting
  const handleVote = useCallback(async (direction: 'left' | 'right') => {
    if (!currentCard) return;

    // Log the activity
    try {
      await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: direction === 'right' ? 'swipe_right' : 'swipe_left',
          cardId: currentCard._id,
          timestamp: new Date().toISOString(),
        }),
      });

      // If right swipe, add to liked cards
      if (direction === 'right') {
        setLikedCards(prev => [...prev, currentCard]);
      }

      // Fetch next card
      const response = await fetch('/api/cards/next');
      const nextCard = await response.json();
      setCurrentCard(nextCard);

    } catch (error) {
      console.error('Failed to process vote:', error);
    }
  }, [currentCard, likedCards.length]);

  // Handle phase-specific rendering
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (phase === 'vote') {
    const handleVoteComplete = async (winnerId: string, loserId: string) => {
      try {
        // Record the vote
        await fetch('/api/battles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            winnerCardId: winnerId,
            loserCardId: loserId,
          }),
        });

        // Back to swipe phase after vote
        setPhase('swipe');
      } catch (error) {
        console.error('Failed to process battle:', error);
      }
    };

    return (
      <div className="flex flex-col items-center w-full p-4">
        <VoteComparison 
          leftCard={likedCards[likedCards.length - 1]}
          rightCard={comparisonCard!}
          onVoteComplete={handleVoteComplete} 
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Swipe Phase</h2>
      {currentCard && (
        <CardSwipeContainer onVote={handleVote}>
          <div className="w-72 h-96 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="h-48 w-full">
              <img 
                src={currentCard.imageUrl} 
                alt={currentCard.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{currentCard.title}</h3>
              <p className="text-gray-600">{currentCard.description}</p>
            </div>
          </div>
        </CardSwipeContainer>
      )}
      <div className="mt-4 text-sm text-gray-500">
        Swipe right to like, left to pass
      </div>
    </div>
  );
};
