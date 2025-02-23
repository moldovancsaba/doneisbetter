import { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_API_URL);

export default function Home() {
  const [task, setCard] = useState('');

  const fetchCards = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cards`);
    } catch (error) {
      console.error('Error fetching cards:', error);
    }
  };

  useEffect(() => {
    fetchCards();
    socket.on('cardsUpdated', fetchCards);

    return () => {
      socket.off('cardsUpdated', fetchCards);
    };
  }, []);

  const addCard = async () => {
    if (task.trim() === '') return;
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/cards`, { task });
      setCard('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Hello World App</h1>
      <div className="max-w-md mx-auto">
        <input
          type="text"
          value={task}
          onChange={(e) => setCard(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addCard()}
          placeholder="Add a card"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <div className="space-y-2">
            <div key={index} className="p-4 bg-white rounded shadow">
              {task}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
// Trigger Vercel Rebuild
// Trigger Vercel Rebuild Again
// Fix: Correct JSX Syntax
