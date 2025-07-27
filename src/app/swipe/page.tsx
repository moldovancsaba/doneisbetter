"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import CardContainer from '@/components/CardContainer';
import { ICard } from '@/interfaces/Card';

const SwipePage: React.FC = () => {
  const router = useRouter();
  const [unswipedCards, setUnswipedCards] = useState<ICard[]>([]);
  const [nextCard, setNextCard] = useState<ICard | null>(null);
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

        if (unrankedCards.length > 0) {
          router.push('/vote');
          return;
        }

        const unswipedRes = await fetch('/api/cards?unswiped=true');
        if (!unswipedRes.ok) {
          throw new Error('Failed to fetch unswiped cards');
        }
        const unswipedCardsData = await unswipedRes.json();
        setUnswipedCards(unswipedCardsData);

        if (unswipedCardsData.length === 0) {
          router.push('/rankings');
        }
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
    if (unswipedCards.length > 0) {
      const randomIndex = Math.floor(Math.random() * unswipedCards.length);
      setNextCard(unswipedCards[randomIndex]);
    }
  }, [unswipedCards]);

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (nextCard) {
      await fetch('/api/swipe/record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cardId: nextCard.md5, direction }),
      });

      if (direction === 'right') {
        router.push('/vote');
      } else {
        // Remove the swiped card from the list of unswiped cards
        setUnswipedCards(unswipedCards.filter((card) => card.md5 !== nextCard.md5));
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
