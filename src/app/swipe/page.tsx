"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSwipeable } from 'react-swipeable';
import { Card as CardComponent } from '@/components/Card';
import Link from 'next/link';

export default function SwipePage() {
  const [session, setSession] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const sessionData = localStorage.getItem('session');
    if (sessionData) {
      setSession(JSON.parse(sessionData));
    }
    setLoading(false);
  }, []);

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (!session) return;

    const card = session.deck[currentCardIndex];
    const response = await fetch('/api/v1/swipe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionData: session,
        swipeData: {
          sessionId: session.sessionId,
          cardId: card.uuid,
          direction,
        }
      }),
    });

    const data = await response.json();

    if (data.requiresVoting) {
        localStorage.setItem('votingContext', JSON.stringify(data.votingContext));
        router.push('/vote');
    } else {
        if (currentCardIndex < session.deck.length - 1) {
            setCurrentCardIndex(currentCardIndex + 1);
        } else {
            await fetch('/api/v1/session/complete', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ sessionId: session.sessionId }),
            });
            router.push('/rankings');
        }
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe('left'),
    onSwipedRight: () => handleSwipe('right'),
    trackMouse: true,
  });

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        No active session. <Link href="/" className="ml-2 text-blue-500">Start a new one</Link>.
      </div>
    );
  }

  const card = session.deck[currentCardIndex];

  return (
    <div className="flex items-center justify-center min-h-screen" {...handlers}>
      <CardComponent card={card} />
    </div>
  );
}
