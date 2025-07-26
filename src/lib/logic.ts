import { ICard } from "@/interfaces/Card";

export const getNextCardToSwipe = (cards: ICard[], seenCards: string[]): ICard | null => {
  const unseenCards = cards.filter((card) => !seenCards.includes(card.md5));
  if (unseenCards.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * unseenCards.length);
  return unseenCards[randomIndex];
};

export const getComparisonCard = (
  rankedCards: ICard[],
  cardToRank: ICard,
  lastComparison?: {
    opponent: ICard;
    result: "win" | "loss";
  }
): ICard | null => {
  if (rankedCards.length === 0) {
    return null;
  }

  if (!lastComparison) {
    // Initial comparison with the latest ranked card
    return rankedCards[rankedCards.length - 1];
  }

  const { opponent, result } = lastComparison;
  const opponentIndex = rankedCards.findIndex((c) => c.md5 === opponent.md5);

  if (result === "win") {
    // Compare with a random card ranked above the opponent
    const higherRankedCards = rankedCards.slice(0, opponentIndex);
    if (higherRankedCards.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * higherRankedCards.length);
    return higherRankedCards[randomIndex];
  } else {
    // Compare with a random card ranked below the opponent
    const lowerRankedCards = rankedCards.slice(opponentIndex + 1);
    if (lowerRankedCards.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * lowerRankedCards.length);
    return lowerRankedCards[randomIndex];
  }
};

export const updateRankings = (
  rankedCards: ICard[],
  cardToRank: ICard,
  comparisonCard: ICard,
  result: "win" | "loss"
): ICard[] => {
  const newRankedCards = [...rankedCards];
  const comparisonIndex = newRankedCards.findIndex((c) => c.md5 === comparisonCard.md5);

  if (result === "win") {
    // Insert the card to rank before the comparison card
    newRankedCards.splice(comparisonIndex, 0, cardToRank);
  } else {
    // Insert the card to rank after the comparison card
    newRankedCards.splice(comparisonIndex + 1, 0, cardToRank);
  }

  return newRankedCards;
};
