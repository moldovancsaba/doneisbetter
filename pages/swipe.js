import { useState, useEffect } from "react";
import { PageWrapper } from "../components/layout/Header";
import { CardStack } from "../components/features/CardStack";
import { LoadingScreen } from "../components/ui/Loading";
import { useToast } from "../components/ui/Toast";
import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";
import { useModuleTheme } from "../contexts/ModuleThemeContext";
// Remove FontAwesome imports as we're using emojis

export default function SwipePage({ initialCards }) {
  const [cards, setCards] = useState(initialCards || []);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date().toISOString());
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const { addToast } = useToast();
  const { theme: moduleTheme } = useModuleTheme();

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

  // Get or create session ID from localStorage
  useEffect(() => {
    // Try to get existing session ID from localStorage
    const storedSessionId = localStorage.getItem('voteSessionId');
    if (storedSessionId) {
      console.log("Using existing session ID:", storedSessionId);
      setSessionId(storedSessionId);
    } else {
      // Create a new random session ID using a timestamp and random number
      const newSessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      console.log("Created new session ID:", newSessionId);
      localStorage.setItem('voteSessionId', newSessionId);
      setSessionId(newSessionId);
    }
  }, []);

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

  const handleSwipe = async (direction) => {
    if (!cards.length) return;
    
    // Get the current card being swiped
    const currentCard = cards[0];
    
    // Create a reference to the card for logging even if we remove it from the state
    const cardId = currentCard._id;
    const cardText = currentCard.text || 'Unknown card';
    
    // Log the swipe locally
    console.log(`Card ${cardId} swiped ${direction === 'right' ? 'liked' : 'disliked'}`);
    
    // Validate session ID
    if (!sessionId) {
      console.error("No session ID available, cannot record swipe interaction");
      addToast("Session ID not found. Your swipes may not be tracked correctly.", "error");
      
      // Remove the swiped card anyway to not block the UI
      setCards((prev) => prev.slice(1));
      return;
    }
    
    // Validate card ID
    if (!cardId) {
      console.error("Card ID is missing, cannot record swipe interaction");
      addToast("Card data is incomplete. Your swipe may not be tracked correctly.", "error");
      
      // Remove the swiped card anyway to not block the UI
      setCards((prev) => prev.slice(1));
      return;
    }
    
    // Ensure direction value is either "left" or "right" for API compatibility
    const validDirection = ['left', 'right'].includes(direction) ? direction : (direction === 'like' ? 'right' : 'left');
    console.log(`Normalized swipe direction: ${validDirection}`);
    
    // Prepare interaction data
    const interactionData = {
      sessionId: sessionId,
      cardId: cardId,
      type: 'swipe',
      action: validDirection, // normalized to 'left' or 'right'
      createdAt: new Date().toISOString() // ISO 8601 with milliseconds
    };
    
    // Remove the card from the stack immediately for better UX
    setCards((prev) => prev.slice(1));
    
    try {
      // Send swipe data to server
      const response = await fetch('/api/interactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(interactionData),
      });
      
      // Parse the response
      const data = await response.json();
      
      if (!response.ok) {
        // Handle specific error messages from the server
        const errorMessage = data.error || 'Failed to record swipe interaction';
        console.error('API error:', errorMessage, data);
        throw new Error(errorMessage);
      }
      
      // Provide feedback on right swipes since they're important for voting
      if (direction === 'right') {
        addToast(`Card liked! You can now vote on "${cardText.substring(0, 30)}..." in the Vote section.`, "success");
      }
      
      console.log('Swipe recorded successfully:', data);
      
    } catch (error) {
      console.error('Error logging swipe:', error);
      
      // Provide more specific error messages when possible
      if (error.message.includes('Card not found')) {
        addToast("Card not found in database. Please refresh the page.", "error");
      } else if (error.message.includes('Validation')) {
        addToast("Data validation error. Please try again.", "error");
      } else {
        addToast("Failed to record your swipe. Please try again later.", "error");
      }
    }
  };

  if (loading || !sessionId) return <LoadingScreen message="Loading cards to swipe..." module="swipe" />;

  return (
    <PageWrapper>
      <div className={`min-h-[80vh] flex flex-col items-center justify-center px-4 ${moduleTheme.lightBg} ${moduleTheme.darkBg}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg mx-auto space-y-6"
        >
          {/* Stats Bar */}
          <div className={`flex justify-between items-center p-4 rounded-lg border ${moduleTheme.borderClass} bg-white dark:bg-gray-800`}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Cards Left:
              </span>
              <span className={`text-lg font-semibold ${moduleTheme.textClass}`}>
                {cards.length}
              </span>
            </motion.div>

            <Button
              onClick={handleRefresh}
              variant="secondary"
              size="sm"
              isLoading={refreshing}
              disabled={refreshing}
              className={`flex items-center border-swipe-200 dark:border-swipe-800 hover:bg-swipe-50 dark:hover:bg-swipe-900/20`}
            >
              🔄 Refresh
            </Button>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`mb-4 p-3 bg-swipe-50/30 dark:bg-swipe-900/20 border ${moduleTheme.borderClass} rounded-lg text-sm ${moduleTheme.textClass}`}
            >
              {error}
              <p className="mt-2">
                <Button 
                  onClick={handleRefresh} 
                  variant="primary"
                  size="xs"
                  className={`${moduleTheme.buttonClass} w-full mt-2`}
                >
                  Try Again
                </Button>
              </p>
            </motion.div>
          )}
          
          {/* Session Information */}
          <div className={`mb-4 p-3 bg-swipe-50/30 dark:bg-swipe-900/20 border ${moduleTheme.borderClass} rounded-lg text-xs text-gray-500 dark:text-gray-400`}>
            Session ID: {sessionId ? `${sessionId.substring(0, 8)}...` : 'Not available'}
            <p className="mt-1">
              Swipe right on cards you like to vote on them later!
            </p>
          </div>

          {/* Card Stack */}
          {cards.length > 0 ? (
            <div className={`border ${moduleTheme.borderClass} rounded-xl p-4 hover:bg-swipe-50/30 dark:hover:bg-swipe-900/10 transition-colors duration-200`}>
              <CardStack 
                cards={cards} 
                onSwipe={handleSwipe} 
              />
            </div>
          ) : (
            <div className={`p-8 text-center ${moduleTheme.lightBg} ${moduleTheme.darkBg} rounded-xl border ${moduleTheme.borderClass}`}>
              <h3 className={`text-xl font-semibold mb-2 ${moduleTheme.textClass}`}>No Cards Available 🔄</h3>
              <p className={`${moduleTheme.textClass} text-opacity-70 dark:text-opacity-70`}>
                Check back later for new cards to review
              </p>
            </div>
          )}

          {/* Last Updated */}
          <div className="mt-4 p-2 text-center">
            <div className={`px-3 py-1 ${moduleTheme.lightBg} ${moduleTheme.darkBg} ${moduleTheme.textClass} text-opacity-70 dark:text-opacity-70 rounded-full text-xs border ${moduleTheme.borderClass}`}>
              Last updated: {lastUpdate}
            </div>
          </div>

          {/* Help Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`text-center mt-8 p-4 rounded-lg border ${moduleTheme.borderClass} bg-swipe-50/30 dark:bg-swipe-900/10`}
          >
            <p className={`text-sm ${moduleTheme.textClass}`}>
              Swipe right to like 👍, left to pass 👎
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
