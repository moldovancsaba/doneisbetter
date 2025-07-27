"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ICard } from '@/interfaces/Card';

const RankingsPage: React.FC = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [rankedCards, setRankedCards] = useState<ICard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) {
      const fetchRankedCards = async () => {
        try {
          const res = await fetch(`/api/rankings?session_id=${sessionId}`);
          if (!res.ok) {
            throw new Error('Failed to fetch ranked cards');
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

      fetchRankedCards();
    }
  }, [sessionId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Your Rankings</h1>
      {rankedCards.length === 0 ? (
        <p>You have no ranked cards yet.</p>
      ) : (
        <ol>
          {rankedCards.map((card) => (
            <li key={card.md5}>{card.content}</li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default RankingsPage;
