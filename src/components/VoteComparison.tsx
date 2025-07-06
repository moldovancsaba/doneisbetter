import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CardSwipeContainer } from './CardSwipeContainer';

import type { Card } from '@/types/card';

interface VoteComparisonProps {
  leftCard: Card;
  rightCard: Card;
  onVoteComplete: (winnerId: string, loserId: string) => void;
}

export const VoteComparison: React.FC<VoteComparisonProps> = ({ leftCard, rightCard, onVoteComplete }) => {
  const handleVote = async (winnerId: string) => {
    const loserId = winnerId === leftCard._id ? rightCard._id : leftCard._id;
    onVoteComplete(winnerId, loserId);
  };


  return (
    <div className="flex items-center justify-center gap-8 w-full">
      {[leftCard, rightCard].map((card, index) => (
        <CardSwipeContainer
          key={card._id}
          onVote={(direction) => {
            const isLeft = index === 0;
            const voteForCurrent = direction === (isLeft ? 'left' : 'right');
            handleVote(voteForCurrent ? card._id : (isLeft ? rightCard._id : leftCard._id));
          }}
          mode="vote"
        >
          <motion.div
            className="card-base max-w-[45vw]"
            initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: index === 0 ? -20 : 20 }}
          >
            <img 
              src={card.imageUrl} 
              alt={card.title}
              className="card-image"
            />
          </motion.div>
        </CardSwipeContainer>
      ))}
    </div>
  );
};
