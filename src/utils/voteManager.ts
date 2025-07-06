interface Card {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  rank?: number;
  battlesWon?: number;
  battlesLost?: number;
}

interface VoteState {
  newCard: Card;
  comparisonCard: Card | null;
  comparedCards: Set<string>;
  lastResult: 'win' | 'loss' | null;
}

export class VoteManager {
  private state: VoteState;
  private likedCards: Card[];

  constructor(newCard: Card, likedCards: Card[]) {
    this.state = {
      newCard,
      comparisonCard: null,
      comparedCards: new Set<string>(),
      lastResult: null
    };
    this.likedCards = likedCards.filter(card => card._id !== newCard._id);
  }

  private getAvailableCards(): Card[] {
    return this.likedCards.filter(card => !this.state.comparedCards.has(card._id));
  }

  private getBetterRankedCards(): Card[] {
    const newRank = this.state.newCard.rank || 1400;
    return this.getAvailableCards()
      .filter(card => (card.rank || 1400) > newRank)
      .sort((a, b) => (a.rank || 1400) - (b.rank || 1400));
  }

  private getWorseRankedCards(): Card[] {
    const newRank = this.state.newCard.rank || 1400;
    return this.getAvailableCards()
      .filter(card => (card.rank || 1400) < newRank)
      .sort((a, b) => (b.rank || 1400) - (a.rank || 1400));
  }

  private getRandomCard(cards: Card[]): Card | null {
    if (cards.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * cards.length);
    return cards[randomIndex];
  }

  getNextComparison(): { leftCard: Card; rightCard: Card | null } | null {
    // If this is the first comparison, get a random card
    if (!this.state.comparisonCard) {
      const availableCards = this.getAvailableCards();
      const rightCard = this.getRandomCard(availableCards);
      if (!rightCard) return null;
      
      this.state.comparisonCard = rightCard;
      this.state.comparedCards.add(rightCard._id);
      return {
        leftCard: this.state.newCard,
        rightCard
      };
    }

    // Based on last result, get next comparison
    if (this.state.lastResult === 'win') {
      const betterCards = this.getBetterRankedCards();
      const rightCard = this.getRandomCard(betterCards);
      if (!rightCard) return null;

      this.state.comparisonCard = rightCard;
      this.state.comparedCards.add(rightCard._id);
      return {
        leftCard: this.state.newCard,
        rightCard
      };
    }

    if (this.state.lastResult === 'loss') {
      const worseCards = this.getWorseRankedCards();
      const rightCard = this.getRandomCard(worseCards);
      if (!rightCard) return null;

      this.state.comparisonCard = rightCard;
      this.state.comparedCards.add(rightCard._id);
      return {
        leftCard: this.state.newCard,
        rightCard
      };
    }

    return null;
  }

  recordResult(newCardWon: boolean): void {
    this.state.lastResult = newCardWon ? 'win' : 'loss';
    
    // Update ranks
    const newRank = this.state.newCard.rank || 1400;
    const compRank = this.state.comparisonCard?.rank || 1400;
    
    if (newCardWon) {
      this.state.newCard.rank = newRank + 32;
      if (this.state.comparisonCard) {
        this.state.comparisonCard.rank = compRank - 32;
      }
    } else {
      this.state.newCard.rank = newRank - 32;
      if (this.state.comparisonCard) {
        this.state.comparisonCard.rank = compRank + 32;
      }
    }
  }

  hasMoreComparisons(): boolean {
    if (!this.state.lastResult) return true;
    
    return this.state.lastResult === 'win' 
      ? this.getBetterRankedCards().length > 0
      : this.getWorseRankedCards().length > 0;
  }
}
