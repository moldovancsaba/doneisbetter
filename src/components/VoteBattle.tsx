'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CardSwipeContainer } from '@/components/CardSwipeContainer';
import { useWebSocket } from '@/hooks/useWebSocket';

interface Card {
  id: string;
  imageUrl: string;
  title: string;
  voteCount?: number;
}

interface VoteBattleProps {
  leftCard: Card;
  rightCard: Card;
  onVote: (winnerId: string, loserId: string) => Promise<void>;
  className?: string;
}

/**
 * VoteBattle Component
 * 
 * Renders a 1v1 comparison between two cards, allowing users to vote through
 * swipe gestures or keyboard inputs. Uses Framer Motion for smooth transitions
 * and animations.
 */
export const VoteBattle: React.FC<VoteBattleProps> = ({
  leftCard,
  rightCard,
  onVote,
  className = '',
}) => {
  const [isVoting, setIsVoting] = useState(false);
  const [votedCard, setVotedCard] = useState<Card | null>(null);
  const [voteProgress, setVoteProgress] = useState<{ left: number; right: number }>({ left: 0, right: 0 });
  const { notifyVote, lastMessage } = useWebSocket();

  // Handle incoming WebSocket messages
  useEffect(() => {
    if (!lastMessage) return;

    if (lastMessage.type === 'voteUpdate' && lastMessage.cardId) {
      // Update vote progress based on incoming votes
      const isLeftCard = lastMessage.cardId === leftCard.id;
      setVoteProgress(prev => ({
        left: prev.left + (isLeftCard ? 1 : 0),
        right: prev.right + (!isLeftCard ? 1 : 0)
      }));
    }
  }, [lastMessage, leftCard.id]);

  // Handle vote submission with loading state management and feedback
  const handleVote = useCallback(async (direction: 'left' | 'right') => {
    if (isVoting) return;

    try {
      setIsVoting(true);
      const winner = direction === 'left' ? leftCard : rightCard;
      const loser = direction === 'left' ? rightCard : leftCard;
      setVotedCard(winner);
      await onVote(winner.id, loser.id);
      
      // Update local vote progress
      setVoteProgress(prev => ({
        left: prev.left + (direction === 'left' ? 1 : 0),
        right: prev.right + (direction === 'right' ? 1 : 0)
      }));

      // Notify other clients about the vote
      notifyVote(winner.id, {
        winnerId: winner.id,
        loserId: loser.id,
        timestamp: new Date().toISOString()
      });

      // Reset voted card after animation
      setTimeout(() => setVotedCard(null), 1500);
    } finally {
      setIsVoting(false);
    }
  }, [leftCard, rightCard, onVote, isVoting]);

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${className}`}>
      {/* Left Card */}
      <div className="relative">
        <AnimatePresence>
          <CardSwipeContainer
            key={`left-${leftCard.id}`}
            onVote={handleVote}
            disabled={isVoting}
            mode="swipe"
          >
            <motion.div
              className="card-base"
              layoutId={`card-${leftCard.id}`}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="card-image-container">
                <img
                  src={leftCard.imageUrl}
                  alt={leftCard.title}
                  className="card-image"
                  loading="lazy"
                />
              </div>
              <div className="card-content">
                <div className="card-rank">
                  🏆 A
                </div>
              </div>

              {/* Loading State */}
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

              {/* Vote Success Indicator */}
              {votedCard?.id === leftCard.id && (
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
            </motion.div>
          </CardSwipeContainer>
        </AnimatePresence>
      </div>

      {/* Right Card */}
      <div className="relative">
        <AnimatePresence>
          <CardSwipeContainer
            key={`right-${rightCard.id}`}
            onVote={handleVote}
            disabled={isVoting}
            mode="swipe"
          >
            <motion.div
              className="card-base"
              layoutId={`card-${rightCard.id}`}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="card-image-container">
                <img
                  src={rightCard.imageUrl}
                  alt={rightCard.title}
                  className="card-image"
                  loading="lazy"
                />
              </div>
              <div className="card-content">
                <div className="card-rank">
                  🏆 B
                </div>
              </div>

              {/* Loading State */}
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

              {/* Vote Success Indicator */}
              {votedCard?.id === rightCard.id && (
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
            </motion.div>
          </CardSwipeContainer>
        </AnimatePresence>
      </div>
    </div>
  );
};
