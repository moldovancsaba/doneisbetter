import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

export default function SwipePage() {
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [swiped, setSwiped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/cards');
        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }
        const data = await res.json();
        setCards(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching cards:', err);
        setError('Failed to load cards. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchCards();
  }, []);

  const handleSwipe = (direction) => {
    if (index >= cards.length) return;
    
    // For now we're just recording the swipe direction in console
    // In a future update, we can implement API calls to save the preference
    console.log(`Card ${cards[index]._id} swiped ${direction === 'right' ? 'liked' : 'disliked'}`);
    
    setSwiped(true);
    setTimeout(() => {
      setSwiped(false);
      setIndex((prev) => prev + 1);
    }, 300);
  };

  const onTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const onTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
    const deltaX = touchEndX.current - touchStartX.current;
    if (deltaX > 50) handleSwipe('right');
    else if (deltaX < -50) handleSwipe('left');
  };

  const card = cards[index];

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-4">
      {loading ? (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300">Loading cards...</p>
        </div>
      ) : error ? (
        <div className="text-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
          >
            Try Again
          </button>
        </div>
      ) : index < cards.length && cards[index] ? (
        <div
          className={`bg-gray-100 dark:bg-gray-800 p-6 shadow-lg rounded-xl w-full max-w-md text-center transition-transform duration-300 ${swiped ? 'scale-95' : 'scale-100'}`}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <p className="text-xl text-gray-900 dark:text-gray-100 mb-6">{cards[index].text}</p>
          <div className="flex justify-between mt-4">
            <button
              onClick={() => handleSwipe('left')}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Dislike
            </button>
            <button
              onClick={() => handleSwipe('right')}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Like
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center p-8 bg-green-50 dark:bg-green-900 rounded-xl shadow-lg max-w-md">
          <h2 className="text-2xl text-gray-800 dark:text-gray-200 font-semibold mb-4">Thank you for your feedback!</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">You've completed all available cards.</p>
          <Link href="/" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Back to Home
          </Link>
        </div>
      )}
    </div>
  );
}
