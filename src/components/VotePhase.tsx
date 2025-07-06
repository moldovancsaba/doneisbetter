import React, { useEffect, useState } from 'react';
import { VoteComparison } from './VoteComparison';
import { updateRanks, persistRanks } from '@/utils/rankingUtils';

import type { Card } from '@/types/card';

type VoteState = {
  newCard: Card;
  rightCard: Card | null;
  comparedCards: Set<string>;
  lastResult: 'win' | 'loss' | null;
};

interface VotePhaseProps {
  likedCards: Card[];
  onVoteComplete: () => void;
}

export const VotePhase: React.FC<VotePhaseProps> = ({ likedCards, onVoteComplete }) => {
  // The newest card (most recently swiped right) will be compared against ranked cards
  const [newestCard, ...rankedCards] = [...likedCards].reverse();
  const [voteState, setVoteState] = useState<VoteState>({
    newCard: newestCard,
    rightCard: null,
    comparedCards: new Set<string>(),
    lastResult: null
  });

  // Get next comparison card based on last result
  const getNextComparisonCard = (): Card | null => {
    const availableCards = rankedCards.filter(card => !voteState.comparedCards.has(card._id));
    if (availableCards.length === 0) return null;

    if (!voteState.lastResult) {
      // First comparison - pick random card
      const randomIndex = Math.floor(Math.random() * availableCards.length);
      return availableCards[randomIndex];
    }

    const currentRank = voteState.newCard.rank || 1400;
    let candidates: Card[];

    if (voteState.lastResult === 'win') {
      // Get cards ranked higher than the current comparison
      candidates = availableCards.filter(card => (card.rank || 1400) > currentRank)
        .sort((a, b) => (a.rank || 1400) - (b.rank || 1400));
    } else {
      // Get cards ranked lower than the current comparison
      candidates = availableCards.filter(card => (card.rank || 1400) < currentRank)
        .sort((a, b) => (b.rank || 1400) - (a.rank || 1400));
    }

    if (candidates.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * candidates.length);
    return candidates[randomIndex];
  };

  // Setup initial comparison
  useEffect(() => {
    const rightCard = getNextComparisonCard();
    setVoteState(prev => ({ ...prev, rightCard }));
  }, []);

  const handleVoteComplete = async (winnerId: string, loserId: string) => {
    const rightCard = voteState.rightCard;
    if (!rightCard) return;

    const newCardWon = winnerId === voteState.newCard._id;
    const [winner, loser] = newCardWon
      ? [voteState.newCard, rightCard]
      : [rightCard, voteState.newCard];

    // Update ranks using unified utility
    const [updatedWinner, updatedLoser] = updateRanks(winner, loser);

    // Update state with new ranks
    voteState.newCard = newCardWon ? updatedWinner : updatedLoser;
    voteState.rightCard = newCardWon ? updatedLoser : updatedWinner;

    // Persist updated ranks
    try {
      await persistRanks([voteState.newCard, voteState.rightCard]);
    } catch (error) {
      console.error('Failed to persist ranks:', error);
    }

    // Mark current card as compared
    const comparedCards = new Set(voteState.comparedCards);
    comparedCards.add(rightCard._id);

    // Get next comparison
    const nextRightCard = getNextComparisonCard();
    setVoteState(prev => ({
      ...prev,
      rightCard: nextRightCard,
      comparedCards,
      lastResult: newCardWon ? 'win' : 'loss'
    }));

    // If no more comparisons, complete voting
    if (!nextRightCard) {
      onVoteComplete();
    }
  };

  if (!voteState.rightCard) {
    return null;
  }

  return (
    <VoteComparison
      leftCard={voteState.newCard}
      rightCard={voteState.rightCard}
      onVoteComplete={handleVoteComplete}
    />
  );
};
