import React, { useState, useEffect } from 'react';
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
  const [availableCards, setAvailableCards] = useState<CardType[]>([]);
  const [currentCard, setCurrentCard] = useState<CardType | null>(null);

  // Initialize available cards
  useEffect(() => {
    setAvailableCards(cards);
  }, [cards]);

  // Select random card when available cards change
  useEffect(() => {
    if (availableCards.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableCards.length);
      setCurrentCard(availableCards[randomIndex]);
    } else {
      setCurrentCard(null);
    }
  }, [availableCards]);

  const handleVote = (direction: 'left' | 'right') => {
    if (!currentCard) return;

    // Remove current card from available cards
    setAvailableCards(prev => prev.filter(card => card._id !== currentCard._id));

    // Handle swipe callbacks
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
<div className="fixed inset-x-0 top-1/2 -translate-y-1/2 mx-auto w-full flex justify-center items-center gap-5">
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
