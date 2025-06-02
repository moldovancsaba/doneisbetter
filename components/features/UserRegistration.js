import { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { useSession } from '../../contexts/SessionContext';

export function UserRegistration() {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();
  const { setUserIdentity } = useSession();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    setIsLoading(true);
    try {
      // Use the username directly as the user identity
      const trimmedUsername = username.trim();
      await setUserIdentity(trimmedUsername);
      addToast(`Welcome, ${trimmedUsername}!`, 'success');
    } catch (error) {
      console.error('Registration error:', error);
      addToast('Failed to register. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-md w-full bg-white dark:bg-gray-800 p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Welcome to DoneIsBetter! 👋</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Please enter your username to start ranking cards.</p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg"
            required
          />
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isLoading}
            disabled={isLoading}
          >
            Start Ranking 🏆
          </Button>
        </form>
      </Card>
    </div>
  );
}

