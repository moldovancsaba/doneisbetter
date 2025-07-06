import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
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
    // Redirect to ranking page
    router.push('/ranking');
    return null;
  }

  return (
    <div className="card-interactive-container">
      <AnimatePresence>
        <CardSwipeContainer
          key={currentCard._id}
          onVote={handleVote}
          mode="swipe"
        >
          <motion.div
            className="card-base max-w-[90vw]"
            layoutId={currentCard._id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="card-image-container">
              <img
                src={currentCard.imageUrl}
                alt={currentCard.title}
                className="card-image"
                loading="lazy"
              />
            </div>
            <div className="card-content">
              <div className="card-rank">
                🎲 Next
              </div>
            </div>
          </motion.div>
        </CardSwipeContainer>
      </AnimatePresence>
    </div>
  );
};
