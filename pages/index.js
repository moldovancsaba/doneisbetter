import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Input } from '../components/ui/Forms';
import { motion } from 'framer-motion';

export default function Home() {
  const [username, setUsername] = useState('');
  const [hasUsername, setHasUsername] = useState(false);

  // Check if username exists in localStorage on mount
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
      setHasUsername(true);
    }
  }, []);

  // Save username to localStorage
  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (username.trim().length > 0) {
      localStorage.setItem('username', username);
      setHasUsername(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold mb-10 text-center">doneisbetter – Swipe Prototype</h1>
      
      <div className="flex flex-col w-full max-w-xs gap-6">
        {!hasUsername ? (
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleUsernameSubmit}
            className="w-full"
          >
            <div className="space-y-4">
              <Input
                label="Enter your username"
                placeholder="Your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="text-lg"
              />
              <button 
                type="submit"
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-lg text-lg text-center transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                Continue
              </button>
            </div>
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full space-y-4"
          >
            <div className="text-center mb-2">
              <p className="text-gray-600 dark:text-gray-300">Logged in as:</p>
              <p className="text-lg font-medium">{username}</p>
              <button 
                onClick={() => setHasUsername(false)} 
                className="text-sm text-primary-500 hover:text-primary-600 mt-1"
              >
                Change username
              </button>
            </div>
            
            <Link href="/swipe" className="block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-lg text-xl text-center transition-colors duration-200 shadow-md hover:shadow-lg">
              SWIPE
            </Link>
            
            <Link href="/vote" className="block bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-lg text-xl text-center transition-colors duration-200 shadow-md hover:shadow-lg">
              VOTE
            </Link>
            
            <Link href="/admin" className="block bg-gray-700 hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-lg text-xl text-center transition-colors duration-200 shadow-md hover:shadow-lg">
              ADMIN
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
