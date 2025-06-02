import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Input } from '../components/ui/Forms';
import { motion } from 'framer-motion';
import { useModuleTheme } from '../contexts/ModuleThemeContext';
import { useSession } from '../contexts/SessionContext';
import { toISOWithMillisec } from '../utils/dates';

export default function Home() {
  const [username, setUsername] = useState('');
  const [hasUsername, setHasUsername] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { allThemes } = useModuleTheme();
  const { setUserIdentity, userId, status, isReady, registerSession } = useSession();

  // Clear data on first load
  useEffect(() => {
    if (typeof window !== 'undefined' && !sessionStorage.getItem('initialized')) {
      localStorage.removeItem('username');
      sessionStorage.setItem('initialized', new Date().toISOString());
    }
  }, []);

  // Session expiry check
  const checkSession = () => {
    const loginTimestamp = localStorage.getItem('loginTimestamp');
    if (loginTimestamp) {
      const lastLogin = new Date(loginTimestamp);
      const now = new Date();
      // Clear session if older than 24 hours
      if (now - lastLogin > 24 * 60 * 60 * 1000) {
        localStorage.clear();
        setHasUsername(false);
      }
    }
  };

  // Check if user exists in session
  useEffect(() => {
    if (isReady) {
      checkSession();
      if (status === 'active' && userId) {
        setUsername(userId);
        // User needs to click login to proceed
      } else if (status === 'error') {
        // Clear any existing username if there's a session error
        setUsername('');
        setHasUsername(false);
      }
    }
  }, [userId, status, isReady]);

  // Handle username submission
  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const trimmedUsername = username.trim();
    if (trimmedUsername.length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }
    
    setIsLoading(true);
    try {
      // Update the user identity
      const success = await setUserIdentity(trimmedUsername);
      if (!success) {
        throw new Error('Failed to set username');
      }
      
      // Set states and timestamps only after both operations succeed
      const timestamp = new Date().toISOString();
      localStorage.setItem('username', trimmedUsername);
      localStorage.setItem('loginTimestamp', timestamp);
      setHasUsername(true);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'An error occurred. Please try again.');
      setHasUsername(false);
      localStorage.removeItem('username');
      localStorage.removeItem('loginTimestamp');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-home-500 to-home-700"
      >
        DoneisBetter 🏠
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
                placeholder="Enter any username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="off"
                className="text-lg"
                error={error}
              />
              <button 
                type="submit"
                disabled={isLoading || !username.trim()}
                className={`w-full bg-home-600 ${!isLoading && 'hover:bg-home-700'} text-white font-semibold py-3 px-6 rounded-lg text-lg text-center transition-colors duration-200 shadow-md hover:shadow-lg border border-home-700/20 ${isLoading || !username.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Logging in...' : 'Continue 🚀'}
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
            <div className="grid gap-4 mt-6">
              {Object.entries(allThemes).map(([moduleName, theme]) => (
                <motion.div
                  key={moduleName}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link 
                    href={moduleName === 'home' ? '/' : `/${moduleName}`}
                    className={`
                      block border ${theme.borderClass}
                      bg-white dark:bg-gray-800 hover:bg-${moduleName}-50/30 dark:hover:bg-${moduleName}-900/20
                      font-semibold py-5 px-6 rounded-lg text-xl
                      transition-all duration-200 shadow-md hover:shadow-lg
                      flex items-center justify-center gap-3
                    `}
                  >
                    <span className={`text-2xl ${theme.iconClass}`}>{theme.name.split(' ')[1]}</span>
                    <span className={theme.textClass}>{theme.name.split(' ')[0]}</span>
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
