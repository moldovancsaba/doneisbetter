import React from 'react';
import { Card } from '@/components/common/Card';
import { Card as CardType } from '@/types/card';

interface RankingGridProps {
  cards: CardType[];
  onCardClick?: (card: CardType) => void;
}

/**
 * RankingGrid Component
 * 
 * Displays cards in a responsive grid layout while preserving image aspect ratios.
 * The grid adapts to screen size and maintains consistent spacing between cards.
 */
export const RankingGrid: React.FC<RankingGridProps> = ({
  cards,
  onCardClick,
}) => {
  return (
    <div className="w-full p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-[1200px] mx-auto">
        {cards.map((card) => (
          <div key={card._id} className="relative flex justify-center items-center">
            <Card
              card={card}
              className="max-w-full max-h-[60vh]"
              onClick={() => onCardClick?.(card)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
