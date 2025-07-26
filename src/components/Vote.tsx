"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Card from '@/components/Card';
import CardContainer from '@/components/CardContainer';
import { ICard } from '@/interfaces/Card';
import { getComparisonCard, updateRankings } from '@/lib/logic';

const Vote: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cardMd5 = searchParams.get('card');

  const [cardToRank, setCardToRank] = useState<ICard | null>(null);
  const [comparisonCard, setComparisonCard] = useState<ICard | null>(null);
  const [rankedCards, setRankedCards] = useState<ICard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastComparison, setLastComparison] = useState<{
    opponent: ICard;
    result: "win" | "loss";
  } | null>(null);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const res = await fetch(`/api/cards?md5=${cardMd5}`);
        if (!res.ok) {
          throw new Error('Failed to fetch card');
        }
        const data = await res.json();
        setCardToRank(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      }
    };

    if (cardMd5) {
      fetchCard();
    }
  }, [cardMd5]);

  useEffect(() => {
    // In a real application, you would fetch the ranked cards from the database
    // For now, we will use a hardcoded list of ranked cards
    const hardcodedRankedCards: ICard[] = [
      // Add some hardcoded ranked cards here
    ];
    setRankedCards(hardcodedRankedCards);
  }, []);

  useEffect(() => {
    if (cardToRank) {
      setComparisonCard(getComparisonCard(rankedCards, cardToRank, lastComparison || undefined));
    }
  }, [cardToRank, rankedCards, lastComparison]);

  const handleVote = (result: 'win' | 'loss') => {
    if (cardToRank && comparisonCard) {
      const newRankedCards = updateRankings(
        rankedCards,
        cardToRank,
        comparisonCard,
        result
      );
      setRankedCards(newRankedCards);
      setLastComparison({ opponent: comparisonCard, result });
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!cardToRank) {
    return <div>Loading...</div>;
  }

  if (!comparisonCard) {
    // No more valid comparisons, go back to swipe
    router.push('/swipe');
    return null;
  }

  return (
    <CardContainer cardCount={2}>
      <div onClick={() => handleVote('win')}>
        <Card
          key={cardToRank._id}
          type={cardToRank.type}
          content={cardToRank.content}
          metadata={cardToRank.metadata}
        />
      </div>
      <div onClick={() => handleVote('loss')}>
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
