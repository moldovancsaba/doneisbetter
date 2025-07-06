import { useState, useCallback } from 'react';
import { ICard } from '@/models/Card';

interface CardError {
  message: string;
  status?: number;
}

interface UseCardsReturn {
  cards: ICard[];
  loading: boolean;
  error: CardError | null;
  fetchCards: () => Promise<void>;
  submitVote: (cardId: string, vote: 1 | -1) => Promise<void>;
  refreshCards: () => Promise<void>;
}

export function useCards(): UseCardsReturn {
  const [cards, setCards] = useState<ICard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<CardError | null>(null);

  const handleApiError = (error: unknown) => {
    console.error('API Error:', error);
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    setError({ message });
    // Clear error after 5 seconds
    setTimeout(() => setError(null), 5000);
  };

  const fetchCards = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/cards');
      if (!response.ok) {
        throw new Error(`Failed to fetch cards: ${response.statusText}`);
      }
      const data = await response.json();
      setCards(data.data || data); // Handle both new and legacy response formats
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const submitVote = useCallback(async (cardId: string, vote: 1 | -1) => {
    setError(null);
    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cardId, vote }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to submit vote: ${response.statusText}`);
      }

      // Update local state or refresh cards
      await fetchCards();
    } catch (error) {
      handleApiError(error);
      throw error; // Allow caller to handle the error if needed
    }
  }, [fetchCards]);

  const refreshCards = useCallback(async () => {
    await fetchCards();
  }, [fetchCards]);

  return {
    cards,
    loading,
    error,
    fetchCards,
    submitVote,
    refreshCards,
  };
}
