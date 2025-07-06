interface Card {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  rank?: number;
}

export const getNextComparisonCard = (
  newCard: Card,
  likedCards: Card[],
  previousComparisons: Set<string> = new Set()
): Card | null => {
  // Filter out the new card and any previously compared cards
  const availableCards = likedCards.filter(
    card => card._id !== newCard._id && !previousComparisons.has(card._id)
  );

  if (availableCards.length === 0) return null;

  // Sort by rank if available
  const sortedCards = [...availableCards].sort((a, b) => {
    if (!a.rank && !b.rank) return 0;
    if (!a.rank) return 1;
    if (!b.rank) return -1;
    return a.rank - b.rank;
  });

  // If the card has no rank yet or lost its last comparison,
  // compare with a random worse-ranked card
  if (!newCard.rank || (sortedCards[0].rank && newCard.rank > sortedCards[0].rank)) {
    const worseCards = sortedCards.filter(
      card => !card.rank || card.rank >= (newCard.rank || Infinity)
    );
    if (worseCards.length > 0) {
      const randomIndex = Math.floor(Math.random() * worseCards.length);
      return worseCards[randomIndex];
    }
  }

  // Otherwise, compare with a random better-ranked card
  const betterCards = sortedCards.filter(
    card => card.rank && (!newCard.rank || card.rank < newCard.rank)
  );
  if (betterCards.length > 0) {
    const randomIndex = Math.floor(Math.random() * betterCards.length);
    return betterCards[randomIndex];
  }

  // If no better cards, pick a random card from all available
  const randomIndex = Math.floor(Math.random() * availableCards.length);
  return availableCards[randomIndex];
};
