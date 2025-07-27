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
    const fetchInitialData = async () => {
      try {
        const [cardsRes, progressRes] = await Promise.all([
          fetch('/api/cards'),
          fetch('/api/progress'),
        ]);

        if (!cardsRes.ok) {
          throw new Error('Failed to fetch cards');
        }
        if (!progressRes.ok) {
          throw new Error('Failed to fetch progress');
        }

        const cardsData = await cardsRes.json();
        const progressData = await progressRes.json();

        // TODO: This is a placeholder. Implement the actual logic.
        const availableCards = cardsData.filter(
          (card: ICard) => !progressData.seenCards.includes(card.md5)
        );
        setCards(availableCards);
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
  }, []);

  useEffect(() => {
    const card = getNextCardToSwipe(cards, seenCards);
    setNextCard(card);

    if (card) {
      // Mark the card as "in_progress"
      // TODO: Implement the API call to update the progress
      console.log(`Marking card ${card.md5} as in_progress`);
    }
  }, [cards, seenCards]);

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (nextCard) {
      setSeenCards([...seenCards, nextCard.md5]);

      // Record the swipe
      await fetch('/api/swipe/record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cardId: nextCard.md5, direction }),
      });

      if (direction === 'left') {
        // Update progress to "swiped_left"
        // TODO: Implement the API call to update the progress
        console.log(`Updating progress for card ${nextCard.md5} to swiped_left`);
      } else {
        // Update progress to "voting_incomplete"
        // TODO: Implement the API call to update the progress
        console.log(`Updating progress for card ${nextCard.md5} to voting_incomplete`);

        // Add card to rankings
        // TODO: Implement the API call to add the card to the rankings
        console.log(`Adding card ${nextCard.md5} to rankings`);

        // Store current card in session storage for voting
        sessionStorage.setItem('cardToVote', JSON.stringify(nextCard));

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
    // TODO: Fetch new batch of cards from "available cards" group
    // If new cards available:
    //   Set first card as active
    //   remove the active card from the "available cards" group
    //   Mark it as "in_progress"
    // If no new cards:
    //   Navigate to rankings page
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
