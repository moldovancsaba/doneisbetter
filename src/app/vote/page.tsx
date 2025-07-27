"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card as CardComponent } from '@/components/Card';
import { ICard } from '@/interfaces/Card';

export default function VotePage() {
  const [session, setSession] = useState(null);
  const [votingContext, setVotingContext] = useState(null);
  const [cards, setCards] = useState<ICard[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const sessionData = localStorage.getItem('session');
    const votingContextData = localStorage.getItem('votingContext');
    if (sessionData && votingContextData) {
      const parsedSession = JSON.parse(sessionData);
      const parsedVotingContext = JSON.parse(votingContextData);
      setSession(parsedSession);
      setVotingContext(parsedVotingContext);
      const cardA = parsedSession.deck.find(c => c.uuid === parsedVotingContext.newCard);
      const cardB = parsedSession.deck.find(c => c.uuid === parsedVotingContext.compareAgainst);
      setCards([cardA, cardB]);
    }
    setLoading(false);
  }, []);

  const handleVote = async (winnerId: string) => {
    if (!session || !votingContext) return;

    const response = await fetch('/api/v1/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionData: session,
        voteData: {
            sessionId: session.sessionId,
            cardA: votingContext.newCard,
            cardB: votingContext.compareAgainst,
            winner: winnerId,
        }
      }),
    });

    const data = await response.json();

    if (data.nextComparison) {
      localStorage.setItem('votingContext', JSON.stringify(data.nextComparison));
      const cardA = session.deck.find(c => c.uuid === data.nextComparison.newCard);
      const cardB = session.deck.find(c => c.uuid === data.nextComparison.compareAgainst);
      setCards([cardA, cardB]);
      setVotingContext(data.nextComparison);
    } else {
      localStorage.removeItem('votingContext');
      router.push('/swipe');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!session || !votingContext || cards.length < 2) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Invalid voting state. <a href="/" className="ml-2 text-blue-500">Start a new session</a>.
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex space-x-4">
        <div onClick={() => handleVote(cards[0].uuid)} className="cursor-pointer">
          <CardComponent card={cards[0]} />
        </div>
        <div onClick={() => handleVote(cards[1].uuid)} className="cursor-pointer">
          <CardComponent card={cards[1]} />
        </div>
      </div>
    </div>
  );
}
