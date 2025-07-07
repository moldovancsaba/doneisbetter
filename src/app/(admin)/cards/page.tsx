'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card as CardComponent } from '@/components/common/Card';

import type { Card } from '@/types/card';

export default function AdminCardsPage() {
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>([]);
  const [imageUrls, setImageUrls] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const response = await fetch('/api/cards');
      if (!response.ok) {
        throw new Error('Failed to fetch cards');
      }
      const data = await response.json();
      setCards(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cards');
    }
  };

  const handleDelete = async (cardId: string) => {
    if (!confirm('Are you sure you want to delete this card?')) {
      return;
    }

    try {
      setError('');
      setSuccess('');
      
      const response = await fetch('/api/cards', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cardId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete card');
      }

      setSuccess('Card deleted successfully!');
      fetchCards();
    } catch (err) {
      console.error('Delete error:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete card');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const urls = imageUrls.split('\n');
      for (const url of urls) {
        if (url.trim()) {
          const response = await fetch('/api/cards', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              imageUrl: url.trim(),
              title: 'Card ' + new Date().toISOString(),
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to create card for one or more URLs');
          }
        }
      }

      setSuccess('Cards created successfully!');
      setImageUrls('');
      fetchCards();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-white mb-6">Card Management</h2>
        
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white rounded-lg shadow-xl">
          <h3 className="text-xl font-semibold mb-4">Add New Cards</h3>
          <div>
            <label htmlFor="urls" className="block text-sm font-medium text-gray-700 mb-2">
              Image URLs (one per line)
            </label>
            <textarea
              id="urls"
              value={imageUrls}
              onChange={(e) => setImageUrls(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="https://example.com/image1.jpg\nhttps://example.com/image2.jpg"
              rows={5}
              required
            />
          </div>

          {error && (
            <div className="mt-2 text-red-600 text-sm">{error}</div>
          )}

          {success && (
            <div className="mt-2 text-green-600 text-sm">{success}</div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? 'Adding...' : 'Add Cards'}
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
          {cards.map((card) => (
<div key={card._id} className="relative flex justify-center items-center">
              <CardComponent
                card={card}
                className="shadow-xl"
              />
              <button
onClick={() => handleDelete(card._id)}
                className="absolute bottom-2 right-2 bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
