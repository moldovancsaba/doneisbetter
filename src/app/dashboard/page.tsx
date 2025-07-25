"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import CardList from '@/components/CardList';

interface ICard {
  _id: string;
  md5: string;
  slug: string;
  type: 'image' | 'text';
  content: string;
}

const DashboardPage: React.FC = () => {
  const [cards, setCards] = useState<ICard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (md5: string) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      try {
        const res = await fetch(`/api/cards?md5=${md5}`, {
          method: 'DELETE',
        });

        if (!res.ok) {
          const { error } = await res.json();
          throw new Error(error);
        }

        setCards(cards.filter((card) => card.md5 !== md5));
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      }
    }
  };

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
          setError('An unknown error occurred');
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Card Management</h1>
      <Link href="/dashboard/cards/new">
        <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Create New Card
        </a>
      </Link>
      <div className="mt-4">
        <CardList cards={cards} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default DashboardPage;
