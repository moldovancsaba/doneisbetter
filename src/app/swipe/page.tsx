"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import CardContainer from '@/components/CardContainer';
import { ICard } from '@/interfaces/Card';

const SwipePage: React.FC = () => {
  const router = useRouter();
  const [deck, setDeck] = useState<ICard[]>([]);
  const [currentCard, setCurrentCard] = useState<ICard | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const startSession = async () => {
      try {
        const sessionRes = await fetch('/api/session', { method: 'POST' });
        if (!sessionRes.ok) {
          throw new Error('Failed to start session');
        }
        const { session_id } = await sessionRes.json();
        setSessionId(session_id);

        const cardsRes = await fetch('/api/cards');
        if (!cardsRes.ok) {
          throw new Error('Failed to fetch cards');
        }
        const cardsData = await cardsRes.json();
        setDeck(cardsData);
        setCurrentCard(cardsData[0]);
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

    startSession();
  }, []);

  const handleSwipe = async (action: 'left' | 'right') => {
    if (currentCard && sessionId) {
      await fetch('/api/swipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          card_id: currentCard.md5,
          action,
        }),
      });

      const newDeck = deck.slice(1);
      setDeck(newDeck);

      if (newDeck.length === 0) {
        router.push(`/rankings?session_id=${sessionId}`);
        return;
      }

      setCurrentCard(newDeck[0]);

      if (action === 'right') {
        sessionStorage.setItem('rightSwipedCard', JSON.stringify(currentCard));
        router.push(`/vote?session_id=${sessionId}`);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!currentCard) {
    return <div>No more cards to swipe.</div>;
  }

  return (
    <CardContainer cardCount={1}>
      <Card {...currentCard} />
      <div>
        <button onClick={() => handleSwipe('left')}>Swipe Left</button>
        <button onClick={() => handleSwipe('right')}>Swipe Right</button>
      </div>
    </CardContainer>
  );
};

export default SwipePage;
