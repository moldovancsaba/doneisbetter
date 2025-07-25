"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ICard {
  _id: string;
  md5: string;
  slug: string;
  type: 'image' | 'text';
  content: string;
}

interface EditCardFormProps {
  md5: string;
}

const EditCardForm: React.FC<EditCardFormProps> = ({ md5 }) => {
  const router = useRouter();
  const [slug, setSlug] = useState('');
  const [type, setType] = useState<'text' | 'image'>('text');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const res = await fetch(`/api/cards?md5=${md5}`);
        if (!res.ok) {
          throw new Error('Failed to fetch card');
        }
        const data: ICard = await res.json();
        setSlug(data.slug);
        setType(data.type);
        setContent(data.content);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      }
    };

    fetchCard();
  }, [md5]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/cards?md5=${md5}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug, type, content }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error);
      }

      router.push('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="text-red-500">{error}</p>}
      <div className="mb-4">
        <label htmlFor="slug" className="block text-gray-700 font-bold mb-2">
          Slug
        </label>
        <input
          type="text"
          id="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="type" className="block text-gray-700 font-bold mb-2">
          Type
        </label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value as 'text' | 'image')}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="text">Text</option>
          <option value="image">Image</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="content" className="block text-gray-700 font-bold mb-2">
          Content
        </label>
        {type === 'text' ? (
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        ) : (
          <input
            type="text"
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Image URL"
            required
          />
        )}
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        disabled={submitting}
      >
        {submitting ? 'Updating...' : 'Update Card'}
      </button>
    </form>
  );
};

export default EditCardForm;
