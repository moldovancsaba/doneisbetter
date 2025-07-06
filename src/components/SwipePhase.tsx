import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CardSwipeContainer } from './CardSwipeContainer';
import type { Card } from '@/types/card';

interface SwipePhaseProps {
  cards: Card[];
  onLeftSwipe?: (card: Card) => void;
  onRightSwipe?: (card: Card) => void;
}

export const SwipePhase: React.FC<SwipePhaseProps> = ({ 
  cards,
  onLeftSwipe,
  onRightSwipe 
}) => {
  const currentCard = cards[0];

  const handleVote = (direction: 'left' | 'right') => {
    if (!currentCard) return;

    if (direction === 'left' && onLeftSwipe) {
      onLeftSwipe(currentCard);
    } else if (direction === 'right' && onRightSwipe) {
      onRightSwipe(currentCard);
    }
  };

  if (!currentCard) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-xl font-semibold">No More Cards</p>
          <p className="mt-2 text-gray-500">
            You've reviewed all available cards!
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!currentCard) return;
      
      switch(e.key) {
        case 'ArrowLeft':
          handleVote('left');
          break;
        case 'ArrowRight':
          handleVote('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentCard]); // Re-attach when current card changes

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-64px)] overflow-hidden">
      {/* Card Area */}
      <div className="relative flex-1 bg-white rounded-xl shadow-lg p-4 min-h-[400px] max-h-[70vh] mx-auto max-w-xl w-full flex items-center justify-center">
        <AnimatePresence>
          <CardSwipeContainer
            key={currentCard._id}
            onVote={handleVote}
          >
            <motion.div
              className="relative w-full h-full rounded-lg overflow-hidden flex items-center justify-center"
              layoutId={currentCard._id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={currentCard.imageUrl}
                alt={currentCard.title}
                className="max-w-full max-h-full object-contain bg-gray-100"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <h2 className="text-white text-xl font-semibold">
                  {currentCard.title}
                </h2>
              </div>
            </motion.div>
          </CardSwipeContainer>
        </AnimatePresence>
      </div>

      {/* Instructions */}
      <div className="mt-4 bg-white rounded-lg shadow p-4 mb-4">
        <h3 className="text-lg font-semibold mb-2">How to Swipe</h3>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-3 bg-gray-50 rounded">
            <p className="font-medium">Swipe Left or ←</p>
            <p className="text-sm text-gray-500 mt-1">Dislike</p>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <p className="font-medium">Swipe Right or →</p>
            <p className="text-sm text-gray-500 mt-1">Like</p>
          </div>
        </div>
      </div>
    </div>
  );
};
