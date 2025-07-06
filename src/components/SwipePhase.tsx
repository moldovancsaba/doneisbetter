import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { CardSwipeContainer } from './CardSwipeContainer';
import type { Card as CardType } from '@/types/card';
import { Card } from '@/components/common/Card';

interface SwipePhaseProps {
  cards: CardType[];
  onLeftSwipe?: (card: CardType) => void;
  onRightSwipe?: (card: CardType) => void;
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
    router.push('/ranking');
    return null;
  }

  return (
    <div className="w-full h-[calc(100vh-80px)] flex items-center justify-center relative p-4 md:p-6 overflow-hidden">
      <div className="absolute inset-0 touch-none pointer-events-none"></div>
      <AnimatePresence>
        <CardSwipeContainer
          key={currentCard._id}
          onVote={handleVote}
          mode="swipe"
        >
          <div className="w-[min(90vw,500px)] mx-auto h-auto overflow-hidden pointer-events-auto">
            {/* Container preserves natural aspect ratio */}
            <Card
              card={currentCard}
              className="w-full shadow-xl"
            />
          </div>
        </CardSwipeContainer>
      </AnimatePresence>
    </div>
  );
};
