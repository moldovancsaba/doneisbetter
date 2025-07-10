import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { CardSwipeContainer } from './CardSwipeContainer';
import type { Card as CardType } from '@/types/card';
import { Card } from '@/components/common/Card';
import LoadingSpinner from '@/components/common/LoadingSpinner';

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
  const [isLoading, setIsLoading] = useState(true);
  const [availableCards, setAvailableCards] = useState<CardType[]>([]);
  const [currentCard, setCurrentCard] = useState<CardType | null>(null);

  // Initialize loading state and cards
  useEffect(() => {
    setIsLoading(true);
    if (cards.length > 0) {
      setAvailableCards(cards);
      setIsLoading(false);
    }
  }, [cards]);

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

  // Show loading spinner while cards are being loaded
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Show message if we're not loading and there's no current card
  if (!isLoading && !currentCard) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No More Cards</h2>
          <p className="text-gray-600">You've reviewed all available cards!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex justify-center items-center top-[calc(50%+40px)] -translate-y-1/2">
      <div className="absolute inset-0 touch-none pointer-events-none"></div>
      <AnimatePresence>
        {currentCard && (
          <CardSwipeContainer
            key={currentCard._id}
            onVote={handleVote}
            mode="swipe"
          >
          <div className="w-[min(calc(100vh_-_4rem),calc(100vw_-_2rem))] mx-auto pointer-events-auto">
            {/* Container adapts to image aspect ratio */}
            <Card
              card={currentCard}
              className="w-full"
            />
          </div>
          </CardSwipeContainer>
        )}
      </AnimatePresence>
    </div>
  );
};
