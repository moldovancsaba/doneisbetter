import React, { useEffect, useState } from 'react';
import { VoteComparison } from './VoteComparison';

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
    const newCardWon = winnerId === voteState.newCard._id;
    const rightCard = voteState.rightCard;
    if (!rightCard) return;

    // Update ranks
    const newRank = voteState.newCard.rank || 1400;
    const rightRank = rightCard.rank || 1400;
    const rankChange = 32; // ELO-style ranking change

    if (newCardWon) {
      voteState.newCard.rank = newRank + rankChange;
      rightCard.rank = rightRank - rankChange;
    } else {
      voteState.newCard.rank = newRank - rankChange;
      rightCard.rank = rightRank + rankChange;
    }

    // Persist ranks
    try {
      await Promise.all([
        fetch('/api/cards/updateRank', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: voteState.newCard._id, rank: voteState.newCard.rank })
        }),
        fetch('/api/cards/updateRank', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: rightCard._id, rank: rightCard.rank })
        })
      ]);
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
    return (
      <div className="flex justify-center items-center p-8">
        <p className="text-lg text-gray-600">Ranking complete!</p>
      </div>
    );
  }

  return (
    <VoteComparison
      leftCard={voteState.newCard}
      rightCard={voteState.rightCard}
      onVoteComplete={handleVoteComplete}
    />
  );
};
