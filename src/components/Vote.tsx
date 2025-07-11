import React from 'react';
import { Card as CardComponent, CardSwipeContainer } from '@/components/common/Card';
import type { Card as CardType } from '@/types/card';

interface VoteProps {
  leftCard: CardType;
  rightCard: CardType;
  onVoteComplete: (winnerId: string, loserId: string) => void;
}

export const Vote: React.FC<VoteProps> = ({ leftCard, rightCard, onVoteComplete }) => {
  const handleVote = async (winnerId: string) => {
    const loserId = winnerId === leftCard._id ? rightCard._id : leftCard._id;
    onVoteComplete(winnerId, loserId);
  };

  return (
    /* Container positioned relative to navigation (80px height) */
    /* Maintains full viewport width while accounting for nav */
    /* Centers cards with consistent 5vw gap */
    <div className="fixed inset-x-0 top-[calc(50%+40px)] -translate-y-1/2 mx-auto w-full max-w-[90vw] px-4">
      <div className="flex justify-center items-center gap-8">
        <div className="w-1/2 flex justify-center items-center">
          <CardSwipeContainer
            key={leftCard._id}
            onVote={(direction) => handleVote(direction === 'right' ? leftCard._id : rightCard._id)}
            mode="vote"
          >
            <CardComponent 
              card={leftCard} 
              className="shadow-xl w-full h-full" 
            />
          </CardSwipeContainer>
        </div>
        <div className="w-1/2 flex justify-center items-center">
          <CardSwipeContainer
            key={rightCard._id}
            onVote={(direction) => handleVote(direction === 'right' ? rightCard._id : leftCard._id)}
            mode="vote"
          >
            <CardComponent 
              card={rightCard} 
              className="shadow-xl w-full h-full" 
            />
          </CardSwipeContainer>
        </div>
      </div>
    </div>
  );
};
