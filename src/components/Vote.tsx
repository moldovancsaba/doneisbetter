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
  searchParams.get('card');

  const [cardToRank, setCardToRank] = useState<ICard | null>(null);
  const [comparisonCard, setComparisonCard] = useState<ICard | null>(null);
  const [rankedCards, setRankedCards] = useState<ICard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastComparison, setLastComparison] = useState<{
    opponent: ICard;
    result: "win" | "loss";
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cardJson = sessionStorage.getItem('cardToVote');
    if (cardJson) {
      setCardToRank(JSON.parse(cardJson));
    } else {
      // Handle the case where the card is not in session storage
      setError("Card to vote not found in session storage.");
    }
  }, []);

  useEffect(() => {
    if (cardToRank) {
      const fetchRankings = async () => {
        try {
          const res = await fetch('/api/rankings');
          if (!res.ok) {
            throw new Error('Failed to fetch rankings');
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

      fetchRankings();
    }
  }, [cardToRank]);

  useEffect(() => {
    if (cardToRank) {
      setComparisonCard(getComparisonCard(rankedCards, cardToRank, lastComparison || undefined));
    }
  }, [cardToRank, rankedCards, lastComparison]);

  const handleVote = async (result: 'win' | 'loss') => {
    if (cardToRank && comparisonCard) {
      const newRankedCards = updateRankings(
        rankedCards,
        cardToRank,
        comparisonCard,
        result
      );
      setRankedCards(newRankedCards);
      setLastComparison({ opponent: comparisonCard, result });

      // Record vote in rankings
      await fetch('/api/rankings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newRankedCards }),
      });

      const nextComparisonCard = getComparisonCard(newRankedCards, cardToRank, {
        opponent: comparisonCard,
        result,
      });

      if (!nextComparisonCard) {
        // Voting complete
        // Update progress state to "voting_complete"
        // TODO: Implement the API call to update the progress
        console.log(`Updating progress for card ${cardToRank.md5} to voting_complete`);
        router.push('/swipe');
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!comparisonCard) {
    // No more valid comparisons, go back to swipe
    router.push('/swipe');
    return null;
  }

  return (
    <CardContainer cardCount={2}>
      {cardToRank && (
        <div onClick={() => handleVote('win')}>
          <Card
            key={cardToRank._id}
            type={cardToRank.type}
            content={cardToRank.content}
            metadata={cardToRank.metadata}
          />
        </div>
      )}
      {comparisonCard && (
        <div onClick={() => handleVote('loss')}>
          <Card
            key={comparisonCard._id}
            type={comparisonCard.type}
            content={comparisonCard.content}
            metadata={comparisonCard.metadata}
          />
        </div>
      )}
    </CardContainer>
  );
};

export default Vote;
