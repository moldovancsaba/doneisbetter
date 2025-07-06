import type { Card } from '@/types/card';

const DEFAULT_RANK = 1400;
const RANK_CHANGE = 32;

/**
 * Updates the ranks of two cards based on a battle outcome
 * @param winner The winning card
 * @param loser The losing card
 * @returns The updated cards with new ranks
 */
export const updateRanks = (winner: Card, loser: Card): [Card, Card] => {
  const winnerRank = winner.rank || DEFAULT_RANK;
  const loserRank = loser.rank || DEFAULT_RANK;

  return [
    { ...winner, rank: winnerRank + RANK_CHANGE },
    { ...loser, rank: loserRank - RANK_CHANGE }
  ];
};

/**
 * Persists updated card ranks to the database
 * @param cards Array of cards with updated ranks to persist
 */
export const persistRanks = async (cards: Card[]): Promise<void> => {
  try {
    await Promise.all(
      cards.map(card => 
        fetch('/api/cards/updateRank', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: card._id, rank: card.rank })
        })
      )
    );
  } catch (error) {
    console.error('Failed to persist ranks:', error);
    throw error;
  }
};
