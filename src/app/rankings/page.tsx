"use client";

import { useEffect, useState } from 'react';
import { ICard } from '@/interfaces/Card';

interface IRanking {
  cardId: string;
  score: number;
  card: ICard;
}

export default function RankingsPage() {
  const [rankings, setRankings] = useState<IRanking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await fetch('/api/v1/global-ranking');
        const data = await response.json();
        setRankings(data.ranking);
      } catch (error) {
        console.error('Failed to fetch rankings', error);
      }
      setLoading(false);
    };

    fetchRankings();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Global Rankings</h1>
      <div className="space-y-4">
        {rankings.map((ranking, index) => (
          <div key={ranking.cardId} className="flex items-center p-4 bg-white border border-gray-200 rounded-lg shadow-md">
            <div className="mr-4 text-xl font-bold">{index + 1}</div>
            <div className="w-full">
              {ranking.card.title && <h3 className="text-lg font-bold">{ranking.card.title}</h3>}
              {ranking.card.type === 'text' && <p className="text-gray-700">{ranking.card.content.text}</p>}
              {ranking.card.type === 'media' && ranking.card.content.mediaUrl && (
                <img src={ranking.card.content.mediaUrl} alt={ranking.card.title || ''} className="object-cover w-full h-64" />
              )}
            </div>
            <div className="ml-4 text-xl font-bold">{ranking.score}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
