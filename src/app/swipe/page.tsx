"use client";

import React, { useEffect, useState } from 'react';
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
  const [cards, setCards] = useState<ICard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <CardContainer cardCount={cards.length}>
      {cards.map((card) => (
        <Card
          key={card._id}
          type={card.type}
          content={card.content}
          metadata={card.metadata}
        />
      ))}
    </CardContainer>
  );
};

export default SwipePage;
