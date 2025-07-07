'use client';

import React, { useEffect, useState } from 'react';
import { Card as CardComponent } from '@/components/common/Card';
import type { Card } from '@/types/card';

interface BattleStats {
  won: number;
  lost: number;
  total: number;
}

export default function RankingPage() {
  const [rankings, setRankings] = useState<Array<Card & { battles?: BattleStats }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/rankings');
        if (!response.ok) {
          throw new Error('Failed to fetch rankings');
        }

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
      <div className="flex items-center justify-center h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[500px] bg-gray-800">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md mx-4">
          <p className="text-2xl font-semibold text-red-600 mb-4">Unable to Load Rankings</p>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-white mb-6">Greatest Memories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
          {rankings.map((card) => (
            <div key={card._id} className="relative w-full flex justify-center items-center">
              <CardComponent
                card={card}
                className="shadow-xl"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
