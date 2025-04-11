'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface Message {
  _id: string;
  content: string;
  createdAt: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages');
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newMessage.trim() }),
      });

      if (!response.ok) throw new Error('Failed to create message');

      const message = await response.json();
      setMessages(prev => [message, ...prev]);
      setNewMessage('');
      toast.success('Message saved!');
    } catch (error) {
      console.error('Error creating message:', error);
      toast.error('Failed to save message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen p-4 bg-gray-50">
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl">
        <form onSubmit={handleSubmit} className="p-4">
          <div className="relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message and press Enter..."
              className="w-full px-4 py-3 text-lg rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              disabled={isSubmitting}
            />
            {isSubmitting && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>
        </form>
      </div>
      <div className="pt-[60vh] space-y-4">
        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500">No messages yet</div>
        ) : (
          messages.map((message) => (
            <div key={message._id} className="bg-white p-4 rounded-lg shadow-sm max-w-xl mx-auto hover:shadow-md transition-shadow">
              <p className="text-gray-800">{message.content}</p>
              <time className="text-sm text-gray-500 mt-2 block">
                {new Date(message.createdAt).toLocaleString()}
              </time>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
