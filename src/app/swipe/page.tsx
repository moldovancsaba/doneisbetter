"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import CardContainer from '@/components/CardContainer';
import { ICard } from '@/interfaces/Card';
import { getNextCardToSwipe } from '@/lib/logic';

const SwipePage: React.FC = () => {
  const router = useRouter();
  const [cards, setCards] = useState<ICard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seenCards, setSeenCards] = useState<string[]>([]);
  const [nextCard, setNextCard] = useState<ICard | null>(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await fetch('/api/cards');
        if (!res.ok) {
          throw new Error('Failed to fetch cards');
        }
        const data = await res.json();
        setCards(data);
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

    fetchCards();
  }, []);

  useEffect(() => {
    setNextCard(getNextCardToSwipe(cards, seenCards));
  }, [cards, seenCards]);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (nextCard) {
      setSeenCards([...seenCards, nextCard.md5]);
      if (direction === 'right') {
        router.push(`/vote?card=${nextCard.md5}`);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!nextCard) {
    return <div>No more cards to swipe.</div>;
  }

  return (
    <CardContainer cardCount={1}>
      <Card
        key={nextCard._id}
        type={nextCard.type}
        content={nextCard.content}
        metadata={nextCard.metadata}
      />
      <div>
        <button onClick={() => handleSwipe('left')}>Swipe Left</button>
        <button onClick={() => handleSwipe('right')}>Swipe Right</button>
      </div>
    </CardContainer>
  );
};

export default SwipePage;
