"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import CardContainer from '@/components/CardContainer';
import { ICard } from '@/interfaces/Card';

const Vote: React.FC = () => {
  const router = useRouter();
  const [unrankedCard, setUnrankedCard] = useState<ICard | null>(null);
  const [rankedCards, setRankedCards] = useState<ICard[]>([]);
  const [comparisonCard, setComparisonCard] = useState<ICard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const unrankedRes = await fetch('/api/cards?unranked=true');
        if (!unrankedRes.ok) {
          throw new Error('Failed to fetch unranked cards');
        }
        const unrankedCards = await unrankedRes.json();

        if (unrankedCards.length === 0) {
          router.push('/swipe');
          return;
        }
        setUnrankedCard(unrankedCards[0]);

        const rankedRes = await fetch('/api/rankings');
        if (!rankedRes.ok) {
          throw new Error('Failed to fetch ranked cards');
        }
        const rankedCardsData = await rankedRes.json();
        setRankedCards(rankedCardsData);
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

    fetchInitialData();
  }, [router]);

  useEffect(() => {
    if (unrankedCard) {
      if (rankedCards.length === 0) {
        // This is the first card to be ranked
        updateRanking(unrankedCard, 1);
        router.push('/swipe');
      } else {
        // Start with the most recently ranked card
        setComparisonCard(rankedCards[rankedCards.length - 1]);
      }
    }
  }, [unrankedCard, rankedCards, router]);

  const handleVote = async (winner: 'left' | 'right') => {
    if (unrankedCard && comparisonCard) {
      // Record the vote
      await fetch('/api/vote/record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardA: unrankedCard.md5,
          cardB: comparisonCard.md5,
          winner: winner === 'left' ? unrankedCard.md5 : comparisonCard.md5,
        }),
      });

      // Adaptive pairwise comparison logic
      const comparisonIndex = rankedCards.findIndex(
        (card) => card.md5 === comparisonCard.md5
      );

      if (winner === 'left') {
        const higherRankedCards = rankedCards.slice(0, comparisonIndex);
        if (higherRankedCards.length === 0) {
          // Unranked card is the new top-ranked card
          const newRanking = 1;
          await updateRanking(unrankedCard, newRanking);
          router.push('/swipe');
        } else {
          const randomIndex = Math.floor(Math.random() * higherRankedCards.length);
          setComparisonCard(higherRankedCards[randomIndex]);
        }
      } else {
        const lowerRankedCards = rankedCards.slice(comparisonIndex + 1);
        if (lowerRankedCards.length === 0) {
          // Unranked card is the new bottom-ranked card
          const newRanking = rankedCards.length + 1;
          await updateRanking(unrankedCard, newRanking);
          router.push('/swipe');
        } else {
          const randomIndex = Math.floor(Math.random() * lowerRankedCards.length);
          setComparisonCard(lowerRankedCards[randomIndex]);
        }
      }
    }
  };

  const updateRanking = async (card: ICard, newRanking: number) => {
    await fetch(`/api/cards?md5=${card.md5}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ranking: newRanking }),
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!unrankedCard || !comparisonCard) {
    return <div>Loading comparison...</div>;
  }

  return (
    <CardContainer cardCount={2}>
      <div onClick={() => handleVote('left')}>
        <Card
          key={unrankedCard._id}
          type={unrankedCard.type}
          content={unrankedCard.content}
          metadata={unrankedCard.metadata}
        />
      </div>
      <div onClick={() => handleVote('right')}>
        <Card
          key={comparisonCard._id}
          type={comparisonCard.type}
          content={comparisonCard.content}
          metadata={comparisonCard.metadata}
        />
      </div>
    </CardContainer>
  );
};

export default Vote;
