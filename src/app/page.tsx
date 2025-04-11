'use client';

import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([...messages, newMessage.trim()]);
      setNewMessage('');
    }
  };

  return (
    <main className="min-h-screen p-4">
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl">
        <form onSubmit={handleSubmit} className="p-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message and press Enter..."
            className="w-full px-4 py-3 text-lg rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>
      </div>
      <div className="pt-[60vh] space-y-4">
        {messages.map((message, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm max-w-xl mx-auto">
            <p className="text-gray-800">{message}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
