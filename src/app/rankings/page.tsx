"use client";

import React, { useEffect, useState } from 'react';
import Rankings from '@/components/Rankings';
import { ICard } from '@/interfaces/Card';

const RankingsPage: React.FC = () => {
  const [rankedCards, setRankedCards] = useState<ICard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    // In a real application, you would fetch the ranked cards from the database
    // For now, we will use a hardcoded list of ranked cards
    const hardcodedRankedCards: ICard[] = [
      // Add some hardcoded ranked cards here
    ];
    setRankedCards(hardcodedRankedCards);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Rankings</h1>
      <Rankings rankedCards={rankedCards} />
    </div>
  );
};

export default RankingsPage;
