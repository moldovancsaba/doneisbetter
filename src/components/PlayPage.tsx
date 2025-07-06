import React, { useState, useCallback, useEffect } from 'react';
import { CardSwipeContainer } from './CardSwipeContainer';

interface Card {
  _id: string;
  title: string;
  description: string;
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

  // Watch likedCards and transition to vote phase when we have 2 or more
  useEffect(() => {
    if (likedCards.length >= 2) {
      setPhase('vote');
    }
  }, [likedCards]);

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
    return (
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">Vote Phase</h2>
        <div className="space-y-4">
          {likedCards.map((card) => (
            <div 
              key={card._id}
              className="p-4 border rounded-lg shadow-sm"
            >
              <h3 className="font-semibold">{card.title}</h3>
              <p className="text-gray-600">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Swipe Phase</h2>
      {currentCard && (
        <CardSwipeContainer onVote={handleVote}>
          <div className="w-72 h-96 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-2">{currentCard.title}</h3>
            <p className="text-gray-600">{currentCard.description}</p>
          </div>
        </CardSwipeContainer>
      )}
      <div className="mt-4 text-sm text-gray-500">
        Swipe right to like, left to pass
      </div>
    </div>
  );
};
