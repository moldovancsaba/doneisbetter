import React from 'react';
import { CardSwipeContainer } from './CardSwipeContainer';
import { Card as CardComponent } from '@/components/common/Card';
import type { Card as CardType } from '@/types/card';

interface VoteComparisonProps {
  leftCard: CardType;
  rightCard: CardType;
  onVoteComplete: (winnerId: string, loserId: string) => void;
}

export const VoteComparison: React.FC<VoteComparisonProps> = ({ leftCard, rightCard, onVoteComplete }) => {
  const handleVote = async (winnerId: string) => {
    const loserId = winnerId === leftCard._id ? rightCard._id : leftCard._id;
    onVoteComplete(winnerId, loserId);
  };

  return (
    /* Container positioned relative to navigation (80px height) */
    /* Maintains full viewport width while accounting for nav */
    /* Centers cards with consistent 5vw gap */
<div className="fixed inset-x-0 top-[calc(50%+40px)] -translate-y-1/2 mx-auto max-w-[80vw] flex justify-center items-center gap-[5vw]">
      <div className="w-full flex justify-center items-center gap-[5vw]">
      <CardSwipeContainer
        key={leftCard._id}
        onVote={(direction) => handleVote(direction === 'right' ? leftCard._id : rightCard._id)}
        mode="vote"
      >
        <CardComponent 
          card={leftCard} 
          className="shadow-xl scale-90" 
        />
      </CardSwipeContainer>
      <CardSwipeContainer
        key={rightCard._id}
        onVote={(direction) => handleVote(direction === 'right' ? rightCard._id : leftCard._id)}
        mode="vote"
      >
        <CardComponent 
          card={rightCard} 
          className="shadow-xl scale-90" 
        />
      </CardSwipeContainer>
      </div>
    </div>
  );
};
