import { useState, useEffect } from "react";
import { PageWrapper } from "../components/layout/Header";
import { CardStack } from "../components/features/CardStack";
import { LoadingScreen } from "../components/ui/Loading";
import { useToast } from "../components/ui/Toast";
import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRedo } from "@fortawesome/free-solid-svg-icons";

export default function SwipePage({ initialCards }) {
  const [cards, setCards] = useState(initialCards || []);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date().toISOString());
  const [error, setError] = useState(null);
  const { addToast } = useToast();

  // Function to fetch cards
  const fetchCards = async (showRefreshing = false) => {
    if (showRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      const response = await fetch('/api/cards');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch cards");
      }
      
      const data = await response.json();
      if (data.success) {
        setCards(data.data);
        setLastUpdate(new Date().toISOString());
      } else {
        throw new Error(data.error || "Failed to fetch cards");
      }
    } catch (err) {
      setError(err.message);
      addToast(err.message, "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Set up polling for new cards every 30 seconds
  useEffect(() => {
    // Initial fetch not needed because we have initialCards from SSR
    
    // Set up polling every 30 seconds
    const pollInterval = setInterval(() => {
      fetchCards(true);
    }, 30000); // 30 seconds
    
    return () => {
      clearInterval(pollInterval);
    };
  }, []);
  
  // Manual refresh function
  const handleRefresh = () => {
    fetchCards(true);
    addToast("Refreshing cards", "info");
  };

  const handleSwipe = (direction) => {
    // Log the swipe locally
    console.log(`Card ${cards[0]._id} swiped ${direction === 'right' ? 'liked' : 'disliked'}`);
    
    // Optional: Send swipe data to server
    fetch('/api/interactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cardId: cards[0]._id,
        interaction: direction === 'right' ? 'liked' : 'disliked',
        timestamp: new Date().toISOString()
      }),
    }).catch(error => console.error('Error logging swipe:', error));

    // Remove the swiped card from the stack
    setCards((prev) => prev.slice(1));
  };

  if (loading) return <LoadingScreen />;

  return (
    <PageWrapper>
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg mx-auto"
        >
          {/* Stats Bar */}
          <div className="flex justify-between items-center mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Cards Left:
              </span>
              <span className="text-lg font-semibold text-primary-500">
                {cards.length}
              </span>
            </motion.div>

            <Button
              onClick={handleRefresh}
              variant="secondary"
              size="sm"
              isLoading={refreshing}
              disabled={refreshing}
              className="flex items-center"
            >
              <FontAwesomeIcon icon={faRedo} className="mr-1" />
              Refresh
            </Button>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-600 dark:text-red-400"
            >
              {error}
              <p className="mt-2">
                <Button 
                  onClick={handleRefresh} 
                  variant="secondary"
                  size="xs"
                >
                  Try Again
                </Button>
              </p>
            </motion.div>
          )}

          {/* Card Stack */}
          {cards.length > 0 ? (
            <CardStack 
              cards={cards} 
              onSwipe={handleSwipe} 
            />
          ) : (
            <div className="p-8 text-center bg-gray-100 dark:bg-gray-800 rounded-xl">
              <h3 className="text-xl font-semibold mb-2">No Cards Available</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Check back later for new cards to review
              </p>
            </div>
          )}

          {/* Last Updated */}
          <div className="mt-4 p-2 text-center">
            <div className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full text-xs">
              Last updated: {lastUpdate}
            </div>
          </div>

          {/* Help Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-8"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Swipe right to like, left to pass
            </p>
          </motion.div>
        </motion.div>
      </div>
    </PageWrapper>
  );
}

// Server-side data fetching
export async function getServerSideProps() {
  try {
    // Fetch cards from API
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = process.env.VERCEL_URL || 'localhost:3000';
    const res = await fetch(`${protocol}://${host}/api/cards`);
    
    if (!res.ok) {
      // If the response is not ok, return empty cards array
      console.error('Failed to fetch cards from API:', res.status, res.statusText);
      return { props: { initialCards: [] } };
    }

    const data = await res.json();
    return {
      props: {
        initialCards: data.success ? data.data : [],
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    // Return empty array in case of error
    return { props: { initialCards: [] } };
  }
}
