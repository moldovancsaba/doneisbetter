"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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

const SwipePage: React.FC = () => {
  const router = useRouter();
  const [cards, setCards] = useState<ICard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [seenCards, setSeenCards] = useState<string[]>([]);

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
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  const handleSwipe = (direction: 'left' | 'right') => {
    setSeenCards([...seenCards, cards[currentIndex].md5]);
    if (direction === 'right') {
      // Navigate to vote page
      router.push(`/vote?card=${cards[currentIndex].md5}`);
    }
    setCurrentIndex(currentIndex + 1);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (currentIndex >= cards.length) {
    return <div>No more cards to swipe.</div>;
  }

  const unseenCards = cards.filter((card) => !seenCards.includes(card.md5));

  if (unseenCards.length === 0) {
    return <div>No more cards to swipe.</div>;
  }

  return (
    <CardContainer cardCount={1}>
      <Card
        key={unseenCards[0]._id}
        type={unseenCards[0].type}
        content={unseenCards[0].content}
        metadata={unseenCards[0].metadata}
      />
      <div>
        <button onClick={() => handleSwipe('left')}>Swipe Left</button>
        <button onClick={() => handleSwipe('right')}>Swipe Right</button>
      </div>
    </CardContainer>
  );
};

export default SwipePage;
