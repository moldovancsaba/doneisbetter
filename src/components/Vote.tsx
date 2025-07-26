"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Card from '@/components/Card';
import CardContainer from '@/components/CardContainer';

interface ICard {
  _id: string;
  md5: string;
  slug: string;
  type: 'image' | 'text';
  content: string;
  metadata?: {
    aspectRatio?: number;
  };
}

const Vote: React.FC = () => {
  const searchParams = useSearchParams();
  const cardMd5 = searchParams.get('card');

  const [card, setCard] = useState<ICard | null>(null);
  const [comparisonCard, setComparisonCard] = useState<ICard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rankedCards, setRankedCards] = useState<ICard[]>([]);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const res = await fetch(`/api/cards?md5=${cardMd5}`);
        if (!res.ok) {
          throw new Error('Failed to fetch card');
        }
        const data = await res.json();
        setCard(data);
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
    if (rankedCards.length > 0) {
      setComparisonCard(rankedCards[rankedCards.length - 1]);
    } else {
      // If there are no ranked cards, go back to the swipe page
      // router.push('/swipe');
    }
  }, [rankedCards]);

  const handleVote = (winner: 'card' | 'comparison') => {
    // Handle the voting logic here
    // For now, we will just log the winner
    console.log('Winner:', winner);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!card || !comparisonCard) {
    // This should be handled more gracefully in a real application
    return <div>Not enough cards to vote.</div>;
  }

  return (
    <CardContainer cardCount={2}>
      <div onClick={() => handleVote('card')}>
        <Card
          key={card._id}
          type={card.type}
          content={card.content}
          metadata={card.metadata}
        />
      </div>
      <div onClick={() => handleVote('comparison')}>
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
