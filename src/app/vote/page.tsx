"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Card from '@/components/Card';
import CardContainer from '@/components/CardContainer';
import { ICard } from '@/interfaces/Card';

const VotePage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [rightSwipedCard, setRightSwipedCard] = useState<ICard | null>(null);
  const [rankedCards, setRankedCards] = useState<ICard[]>([]);
  const [comparisonCard, setComparisonCard] = useState<ICard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cardJson = sessionStorage.getItem('rightSwipedCard');
    if (cardJson) {
      setRightSwipedCard(JSON.parse(cardJson));
    } else {
      // Handle the case where the card is not in session storage
      setError("Right-swiped card not found in session storage.");
    }
  }, []);

  useEffect(() => {
    if (rightSwipedCard) {
      const fetchRankedCards = async () => {
        try {
          const res = await fetch(`/api/rankings?session_id=${sessionId}`);
          if (!res.ok) {
            throw new Error('Failed to fetch ranked cards');
          }
          const data = await res.json();
          setRankedCards(data);
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('An unknown error occurred');
          }
        } finally {
          setLoading(false);
        }
      };

      fetchRankedCards();
    }
  }, [rightSwipedCard, sessionId]);

  useEffect(() => {
    if (rankedCards.length > 0) {
      // Start with the most recently placed card
      setComparisonCard(rankedCards[rankedCards.length - 1]);
    }
  }, [rankedCards]);

  const handleVote = async (winner: 'left' | 'right') => {
    if (rightSwipedCard && comparisonCard && sessionId) {
      await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          left_card_id: comparisonCard.md5,
          right_card_id: rightSwipedCard.md5,
          winner: winner === 'left' ? comparisonCard.md5 : rightSwipedCard.md5,
        }),
      });

      // Adaptive pairwise comparison logic
      const comparisonIndex = rankedCards.findIndex(
        (card) => card.md5 === comparisonCard.md5
      );

      if (winner === 'right') {
        const higherRankedCards = rankedCards.slice(0, comparisonIndex);
        if (higherRankedCards.length === 0) {
          // Right-swiped card is the new top-ranked card
          router.push(`/swipe?session_id=${sessionId}`);
        } else {
          const randomIndex = Math.floor(Math.random() * higherRankedCards.length);
          setComparisonCard(higherRankedCards[randomIndex]);
        }
      } else {
        const lowerRankedCards = rankedCards.slice(comparisonIndex + 1);
        if (lowerRankedCards.length === 0) {
          // Right-swiped card is the new bottom-ranked card
          router.push(`/swipe?session_id=${sessionId}`);
        } else {
          const randomIndex = Math.floor(Math.random() * lowerRankedCards.length);
          setComparisonCard(lowerRankedCards[randomIndex]);
        }
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!rightSwipedCard || !comparisonCard) {
    // This should be handled by the logic that redirects to swipe if there are no ranked cards
    return <div>Loading comparison...</div>;
  }

  return (
    <CardContainer cardCount={2}>
      <div onClick={() => handleVote('left')}>
        <Card {...comparisonCard} />
      </div>
      <div onClick={() => handleVote('right')}>
        <Card {...rightSwipedCard} />
      </div>
    </CardContainer>
  );
};

export default VotePage;
