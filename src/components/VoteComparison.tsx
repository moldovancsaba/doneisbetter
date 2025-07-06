import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import type { Card } from '@/types/card';

interface VoteComparisonProps {
  leftCard: Card;
  rightCard: Card;
  onVoteComplete: (winnerId: string, loserId: string) => void;
}

export const VoteComparison: React.FC<VoteComparisonProps> = ({ leftCard, rightCard, onVoteComplete }) => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const handleVote = async (winnerId: string) => {
    const loserId = winnerId === leftCard._id ? rightCard._id : leftCard._id;
    setSelectedCard(winnerId);
    onVoteComplete(winnerId, loserId);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch(e.key) {
        case 'ArrowLeft':
          handleVote(leftCard._id);
          break;
        case 'ArrowRight':
          handleVote(rightCard._id);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [leftCard._id, rightCard._id]); // Re-attach when cards change

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto h-full">
      <h2 className="text-2xl font-bold mb-8">Which one do you prefer?</h2>
      <div className="flex justify-center gap-8 w-full h-full">
        {[leftCard, rightCard].map((card, index) => (
          <motion.div
            key={card._id}
            className={`
              flex-1 max-w-xl bg-white rounded-xl shadow-lg p-6 cursor-pointer
              transition-all duration-300 min-h-[400px] max-h-[70vh]
              ${selectedCard === card._id ? 'ring-4 ring-blue-500' : 'hover:shadow-xl'}
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleVote(card._id)}
            initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: index === 0 ? -20 : 20 }}
          >
            <div className="h-3/4 w-full mb-4">
              <img 
                src={card.imageUrl} 
                alt={card.title}
                className="w-full h-full object-contain bg-gray-100 rounded-lg"
              />
            </div>
            <div className="flex flex-col flex-grow">
              <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
              <div className="text-sm text-gray-500 mt-2">
                Rank: {card.rank || 1400}
              </div>
              <div className="mt-4 flex justify-center">
                <motion.button
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Choose This One
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-8 text-sm text-gray-500">
        Click on the card you prefer or use arrow keys (← →) to cast your vote
      </div>
    </div>
  );
};
