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
      <div className="flex items-center justify-center h-[500px]">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">Error</p>
          <p className="mt-2">{error}</p>
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
            <div key={card._id} className="relative aspect-[3/4] flex justify-center items-center">
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
