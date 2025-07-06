/**
 * CardRanking module handles the progressive ranking system for swiped cards.
 * It implements an ELO-inspired rating system where cards are ranked based on
 * user preferences through comparison outcomes.
 */

import { Card } from '../types/card';

// Initial rating for newly liked cards
const INITIAL_RATING = 1400;
// K-factor determines how much rating changes after each comparison
const K_FACTOR = 32;

interface RankingOutcome {
  preferredCardId: string;
  otherCardId: string;
}

/**
 * Calculates the expected score in a comparison between two ratings
 * @param rating1 Rating of the first card
 * @param rating2 Rating of the second card
 * @returns Expected score between 0 and 1
 */
const calculateExpectedScore = (rating1: number, rating2: number): number => {
  return 1 / (1 + Math.pow(10, (rating2 - rating1) / 400));
};

/**
 * Updates ratings based on comparison outcome
 * @param winnerRating Current rating of the preferred card
 * @param loserRating Current rating of the non-preferred card
 * @returns Object containing updated ratings
 */
const updateRatings = (winnerRating: number, loserRating: number) => {
  const expectedWinnerScore = calculateExpectedScore(winnerRating, loserRating);
  const expectedLoserScore = calculateExpectedScore(loserRating, winnerRating);

  const newWinnerRating = Math.round(winnerRating + K_FACTOR * (1 - expectedWinnerScore));
  const newLoserRating = Math.round(loserRating + K_FACTOR * (0 - expectedLoserScore));

  return {
    newWinnerRating,
    newLoserRating
  };
};

/**
 * Selects a random card from the liked cards collection for comparison
 * @param likedCards Array of previously liked cards
 * @param excludeCardId ID of card to exclude from selection
 * @returns Selected card for comparison
 */
export const selectComparisonCard = (likedCards: Card[], excludeCardId: string): Card | null => {
  const eligibleCards = likedCards.filter(card => card.id !== excludeCardId);
  if (eligibleCards.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * eligibleCards.length);
  return eligibleCards[randomIndex];
};

/**
 * Processes a new card comparison outcome and updates ratings
 * @param outcome Comparison outcome containing preferred and other card IDs
 * @param likedCards Current collection of liked cards with their ratings
 * @returns Updated ratings for both cards
 */
export const processComparisonOutcome = (
  outcome: RankingOutcome,
  likedCards: Card[]
): { [key: string]: number } => {
  const preferredCard = likedCards.find(card => card.id === outcome.preferredCardId);
  const otherCard = likedCards.find(card => card.id === outcome.otherCardId);

  if (!preferredCard || !otherCard) {
    throw new Error('Cards not found in liked collection');
  }

  const preferredRating = preferredCard.rank ?? INITIAL_RATING;
  const otherRating = otherCard.rank ?? INITIAL_RATING;

  const { newWinnerRating, newLoserRating } = updateRatings(preferredRating, otherRating);

  return {
    [outcome.preferredCardId]: newWinnerRating,
    [outcome.otherCardId]: newLoserRating
  };
};

/**
 * Determines the position of a new card in the ranked list
 * @param cardRating Rating of the card to position
 * @param likedCards Current collection of liked cards
 * @returns Index where the new card should be inserted
 */
export const determineCardPosition = (cardRating: number, likedCards: Card[]): number => {
  const sortedCards = [...likedCards].sort((a, b) => 
    (b.rank ?? INITIAL_RATING) - (a.rank ?? INITIAL_RATING)
  );
  
  return sortedCards.findIndex(card => 
    (card.rank ?? INITIAL_RATING) <= cardRating
  );
};
