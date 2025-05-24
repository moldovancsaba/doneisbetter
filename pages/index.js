import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Input } from '../components/ui/Forms';
import { motion } from 'framer-motion';
import { useModuleTheme } from '../contexts/ModuleThemeContext';

export default function Home() {
  const [username, setUsername] = useState('');
  const [hasUsername, setHasUsername] = useState(false);
  const { allThemes } = useModuleTheme();

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
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-home-500 to-home-700"
      >
        doneisbetter 🏠
      </motion.h1>
      
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
                className="w-full bg-home-600 hover:bg-home-700 text-white font-semibold py-3 px-6 rounded-lg text-lg text-center transition-colors duration-200 shadow-md hover:shadow-lg"
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
                className="text-sm text-home-500 hover:text-home-600 mt-1"
              >
                Change username
              </button>
            </div>
            
            {/* Navigation Cards */}
            <div className="grid gap-4">
              {Object.entries(allThemes).map(([moduleName, theme]) => (
                <motion.div
                  key={moduleName}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link 
                    href={moduleName === 'home' ? '/' : `/${moduleName}`}
                    className={`
                      block bg-gradient-to-r ${theme.gradient} text-white
                      font-semibold py-5 px-6 rounded-lg text-xl text-center
                      transition-all duration-200 shadow-md hover:shadow-lg
                      flex items-center justify-center gap-3
                    `}
                  >
                    <span className="text-2xl">{theme.name.split(' ')[1]}</span>
                    <span>{theme.name.split(' ')[0]}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
