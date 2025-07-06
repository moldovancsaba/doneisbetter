'use client';

import { useEffect, useState } from 'react';
import { CardImage } from '@/components/CardImage';

interface Ranking {
  cardId: string;
  imageUrl: string;
  title: string;
  votes: {
    left: number;
    right: number;
    total: number;
  };
}

export default function RankingsPage() {
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/rankings');
        if (!response.ok) throw new Error('Failed to fetch rankings');
        const data = await response.json();
        setRankings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch rankings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRankings();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">Error</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Rankings</h1>
        
        <div className="space-y-6">
          {rankings.map((ranking, index) => (
            <div
              key={ranking.cardId}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="flex items-center p-4 md:p-6 lg:p-8">
                <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 relative rounded-lg overflow-hidden bg-gray-100">
                  <CardImage
                    src={ranking.imageUrl}
                    alt={ranking.title}
                    size="md"
                    className="bg-gray-100"
                  />
                </div>
                <div className="ml-6 flex-grow">
                  <h2 className="text-xl font-semibold">{ranking.title}</h2>
                  <div className="mt-2 flex space-x-8">
                    <div>
                      <p className="text-sm text-gray-500">Left Votes</p>
                      <p className="text-lg font-medium">{ranking.votes.left}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Right Votes</p>
                      <p className="text-lg font-medium">{ranking.votes.right}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Votes</p>
                      <p className="text-lg font-medium">{ranking.votes.total}</p>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-6">
                  <div className="text-2xl font-bold text-blue-600">
                    #{index + 1}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {rankings.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-xl font-semibold text-gray-600">No Rankings Yet</p>
              <p className="mt-2 text-gray-500">Vote on some cards to see them appear here!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
