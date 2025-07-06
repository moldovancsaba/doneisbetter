'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CardSwipeContainer } from '@/components/CardSwipeContainer';
import { VotingStats } from '@/components/VotingStats';

// Types for our card data structure
interface Card {
  _id: string;  // MongoDB ID
  id: string;   // Alias for _id
  imageUrl: string;
  title: string;
}

/**
 * Play Page Component
 * 
 * Primary interface for the card voting application.
 * Handles card queue management, voting mechanics, and statistics display.
 */
export default function PlayPage() {
  // State Management
  const [cards, setCards] = useState<Card[]>([]);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    leftVotes: 0,
    rightVotes: 0,
    totalVotes: 0,
  });

  // Fetch initial card data
  useEffect(() => {
    const fetchCards = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/cards');
        if (!response.ok) throw new Error('Failed to fetch cards');
        
        const data = await response.json();
        setCards(data);
        setCurrentCard(data[0] || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCards();
  }, []);

  // Handle voting logic
  const handleVote = useCallback(async (direction: 'left' | 'right') => {
    if (!currentCard) return;

    try {
      // Optimistically update stats
      setStats(prev => ({
        ...prev,
        [direction === 'left' ? 'leftVotes' : 'rightVotes']: prev[direction === 'left' ? 'leftVotes' : 'rightVotes'] + 1,
        totalVotes: prev.totalVotes + 1,
      }));

      // Record vote in the backend
      const response = await fetch('/api/rankings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId: currentCard._id || currentCard.id,  // Use MongoDB _id if available
          vote: direction,
        }),
      });

      if (!response.ok) throw new Error('Failed to record vote');

      // Move to next card
      setCards(prev => prev.slice(1));
      setCurrentCard(cards[1] || null);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record vote');
      // Revert stats on error
      setStats(prev => ({
        ...prev,
        [direction === 'left' ? 'leftVotes' : 'rightVotes']: prev[direction === 'left' ? 'leftVotes' : 'rightVotes'] - 1,
        totalVotes: prev.totalVotes - 1,
      }));
    }
  }, [currentCard, cards]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Statistics Panel */}
          <div className="md:col-span-1">
            <VotingStats
              leftVotes={stats.leftVotes}
              rightVotes={stats.rightVotes}
              totalVotes={stats.totalVotes}
              className="sticky top-8"
            />
          </div>

          {/* Card Stack Area */}
          <div className="md:col-span-2">
            <div className="relative h-[500px] bg-white rounded-xl shadow-lg p-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-full">
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
              ) : currentCard ? (
                <AnimatePresence>
                  <CardSwipeContainer
                    key={currentCard.id}
                    onVote={handleVote}
                  >
                    <motion.div
                      className="relative w-full h-full rounded-lg overflow-hidden"
                      layoutId={currentCard.id}
                    >
                      <img
                        src={currentCard.imageUrl}
                        alt={currentCard.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                        <h2 className="text-white text-xl font-semibold">
                          {currentCard.title}
                        </h2>
                      </div>
                    </motion.div>
                  </CardSwipeContainer>
                </AnimatePresence>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <p className="text-xl font-semibold">No More Cards</p>
                    <p className="mt-2 text-gray-500">
                      You've voted on all available cards!
                    </p>
                    <button
                      onClick={() => window.location.reload()}
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Start Over
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Input Section / Instructions */}
            <div className="mt-8 bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold mb-2">How to Vote</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-gray-50 rounded">
                  <p className="font-medium">Swipe Left</p>
                  <p className="text-sm text-gray-500 mt-1">or press ←</p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <p className="font-medium">Swipe Right</p>
                  <p className="text-sm text-gray-500 mt-1">or press →</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
