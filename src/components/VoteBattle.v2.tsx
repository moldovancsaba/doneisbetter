'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OrientationProvider, useOrientation } from '@/components/layout/OrientationProvider';
import { Card } from '@/components/common/Card';
import { CardSwipeContainer } from '@/components/CardSwipeContainer';
import { useWebSocket } from '@/hooks/useWebSocket';
import type { Card as CardType } from '@/types/card';

interface VoteCardsProps {
  leftCard: CardType;
  rightCard: CardType;
  onVote: (winner: CardType, loser: CardType) => void;
  isVoting: boolean;
  votedCardId: string | null;
}

const VoteCards: React.FC<VoteCardsProps> = ({ leftCard, rightCard, onVote, isVoting, votedCardId }) => {
  const { orientation } = useOrientation();

  const containerStyles = orientation === 'landscape'
    ? 'flex-row gap-8'
    : 'flex-col gap-8';

  const cardContainerStyles = orientation === 'landscape'
    ? 'w-[40vmin]'
    : 'w-[60vmin]';

  return (
    <div className="w-full h-[calc(100vh-80px)] flex items-center justify-center">
      <div className={`flex justify-center items-center ${containerStyles}`}>
        <div className={cardContainerStyles}>
          <CardSwipeContainer
            key={`left-${leftCard._id}`}
            onVote={(direction) => direction === 'right' && onVote(leftCard, rightCard)}
            disabled={isVoting}
            mode="vote"
          >
            <Card card={leftCard} className="w-full h-full" />
            {isVoting && (
              <motion.div 
                className="absolute inset-0 bg-black/20 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white" />
              </motion.div>
            )}
            {votedCardId === leftCard._id && (
              <motion.div 
                className="absolute inset-0 bg-green-500/30 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <div className="bg-gray-900 rounded-full p-4">
                  <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </motion.div>
            )}
          </CardSwipeContainer>
        </div>
        <div className={cardContainerStyles}>
          <CardSwipeContainer
            key={`right-${rightCard._id}`}
            onVote={(direction) => direction === 'right' && onVote(rightCard, leftCard)}
            disabled={isVoting}
            mode="vote"
          >
            <Card card={rightCard} className="w-full h-full" />
            {isVoting && (
              <motion.div 
                className="absolute inset-0 bg-black/20 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white" />
              </motion.div>
            )}
            {votedCardId === rightCard._id && (
              <motion.div 
                className="absolute inset-0 bg-green-500/30 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <div className="bg-gray-900 rounded-full p-4">
                  <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </motion.div>
            )}
          </CardSwipeContainer>
        </div>
      </div>
    </div>
  );
};

interface VoteBattleProps {
  leftCard: CardType;
  rightCard: CardType;
  onVote: (winnerId: string, loserId: string) => Promise<void>;
  className?: string;
}

const VoteBattleInner: React.FC<VoteBattleProps> = ({
  leftCard,
  rightCard,
  onVote,
  className = '',
}) => {
  const [isVoting, setIsVoting] = useState(false);
  const [votedCardId, setVotedCardId] = useState<string | null>(null);
  const { notifyVote } = useWebSocket();

  const handleVote = useCallback(async (winner: CardType, loser: CardType) => {
    if (isVoting) return;

    try {
      setIsVoting(true);
      setVotedCardId(winner._id);
      await onVote(winner._id, loser._id);
      
      notifyVote(winner._id, {
        winnerId: winner._id,
        loserId: loser._id,
        timestamp: new Date().toISOString()
      });

      setTimeout(() => setVotedCardId(null), 1500);
    } finally {
      setIsVoting(false);
    }
  }, [onVote, isVoting, notifyVote]);

  return (
    <div className={className}>
      <VoteCards
        leftCard={leftCard}
        rightCard={rightCard}
        onVote={handleVote}
        isVoting={isVoting}
        votedCardId={votedCardId}
      />
    </div>
  );
};

export const VoteBattle: React.FC<VoteBattleProps> = (props) => {
  return (
    <OrientationProvider>
      <VoteBattleInner {...props} />
    </OrientationProvider>
  );
};
