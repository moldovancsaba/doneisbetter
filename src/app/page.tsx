"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const startSession = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/session/start', {
        method: 'POST',
      });
      const data = await response.json();
      localStorage.setItem('session', JSON.stringify(data));
      router.push('/swipe');
    } catch (error) {
      console.error('Failed to start session', error);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <button
        onClick={startSession}
        disabled={loading}
        className="px-6 py-3 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Starting...' : 'Start New Session'}
      </button>
    </div>
  );
}
