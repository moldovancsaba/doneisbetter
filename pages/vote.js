import { useState, useEffect } from "react";
import Link from "next/link";
import { PageWrapper } from "../components/layout/Header";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { LoadingScreen } from "../components/ui/Loading";
import { useToast } from "../components/ui/Toast";
import { motion, AnimatePresence } from "framer-motion";
import { useModuleTheme } from "../contexts/ModuleThemeContext";

export default function VotePage() {
  const [votingPair, setVotingPair] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [voteHistory, setVoteHistory] = useState([]);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const { addToast } = useToast();
  const [keyboardEnabled, setKeyboardEnabled] = useState(true);
  const [hasSwipedCards, setHasSwipedCards] = useState(true); // Initially assume true, will be verified
  const { theme: moduleTheme } = useModuleTheme();
  
  // Helper function to safely extract card ID
  const getCardId = (card) => {
    if (!card) {
      console.error("Card is null or undefined");
      return null;
    }
    
    // Log card structure to debug
    console.log("Card structure:", card);
    
    // Handle various card ID formats
    if (typeof card === 'string') {
      return card; // Card is already an ID string
    }
    
    if (card._id) {
      return typeof card._id === 'string' ? card._id : card._id.toString();
    }
    
    if (card.id) {
      return typeof card.id === 'string' ? card.id : card.id.toString();
    }
    
    console.error("Could not extract ID from card:", card);
    return null;
  };

  // Check if user has swiped cards
  const checkUserHasSwipedCards = async () => {
    if (!sessionId) {
      console.error("Cannot check swiped cards without sessionId");
      return false;
    }
    
    try {
      const url = `/api/user-votes?sessionId=${encodeURIComponent(sessionId)}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error("Failed to fetch user votes:", response.status);
        return false;
      }
      
      const data = await response.json();
      const hasSwiped = data.success && Array.isArray(data.data) && data.data.length > 0;
      console.log("User has swiped cards:", hasSwiped, "Count:", data.data?.length || 0);
      return hasSwiped;
    } catch (err) {
      console.error("Error checking if user has swiped cards:", err);
      return false;
    }
  };

  // Fetch a new pair of cards for voting
  const fetchVotingPair = async () => {
    setLoading(true);
    
    // Verify session ID is available
    if (!sessionId) {
      console.error("Attempting to fetch voting pair without a valid session ID");
      setLoading(false);
      setError("Session ID is required to get vote pairs. Please refresh the page or try again.");
      addToast("Session ID is missing. Please refresh the page.", "error");
      return;
    }
    
    // Check if user has swiped cards first
    const hasCards = await checkUserHasSwipedCards();
    setHasSwipedCards(hasCards);
    
    if (!hasCards) {
      setLoading(false);
      setError("You need to swipe on some cards first before you can vote!");
      return;
    }
    
    try {
      // Include sessionId as a query parameter
      const url = `/api/vote/pair?sessionId=${encodeURIComponent(sessionId)}`;
      console.log(`Fetching voting pair with URL: ${url}`);
      
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch voting pair");
      }
      
      const data = await response.json();
      if (data.success) {
        // Log the voting pair data structure
        console.log("Voting pair data:", data.data);
        
        // Verify card data is valid
        if (!data.data.card1 || !data.data.card2) {
          throw new Error("Invalid card data received from server");
        }
        
        // Log card ID extraction to verify
        console.log("Card 1 ID:", getCardId(data.data.card1));
        console.log("Card 2 ID:", getCardId(data.data.card2));
        
        setVotingPair(data.data);
      } else {
        throw new Error(data.error || "Failed to fetch voting pair");
      }
    } catch (err) {
      setError(err.message);
      addToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Submit vote
  const submitVote = async (winningCard, losingCard) => {
    if (submitting) return;
    setKeyboardEnabled(false);
    
    // Validate that we have a sessionId
    if (!sessionId) {
      const errorMsg = "Session ID not found. Please refresh the page and try again.";
      setError(errorMsg);
      addToast(errorMsg, "error");
      return;
    }
    
    // Extract card IDs safely
    const winnerId = getCardId(winningCard);
    const loserId = getCardId(losingCard);
    
    // Validate card IDs
    if (!winnerId || !loserId) {
      const errorMsg = "Invalid card data. Please refresh and try again.";
      setError(errorMsg);
      addToast(errorMsg, "error");
      console.error("Invalid card IDs:", { winningCard, losingCard });
      return;
    }
    
    setSubmitting(true);
    try {
      console.log(`Submitting vote with sessionId: ${sessionId}`);
      console.log(`Winner ID: ${winnerId}, Loser ID: ${loserId}`);
      
      const voteData = {
        sessionId: sessionId, // Use the sessionId from localStorage
        winnerId: winnerId,
        loserId: loserId,
        type: votingPair.type
      };
      
      console.log("Vote submission data:", voteData);
      
      const response = await fetch('/api/vote/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(voteData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit vote");
      }
      
      const data = await response.json();
      if (data.success) {
        // Add to vote history
        setVoteHistory(prev => [
          {
            winner: getCardId(votingPair.card1) === winnerId ? votingPair.card1 : votingPair.card2,
            loser: getCardId(votingPair.card1) === loserId ? votingPair.card1 : votingPair.card2,
            timestamp: new Date()
          },
          ...prev.slice(0, 9) // Keep last 10 votes
        ]);
        
        addToast("Vote submitted successfully", "success");
        
        // Fetch a new pair
        fetchVotingPair();
        setKeyboardEnabled(true);
      } else {
        throw new Error(data.error || "Failed to submit vote");
      }
    } catch (err) {
      setError(err.message);
      addToast(err.message, "error");
    } finally {
      setSubmitting(false);
      setKeyboardEnabled(true);
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

  // Initial fetch - only after sessionId is available
  useEffect(() => {
    if (sessionId) {
      console.log("Session ID available, fetching initial voting pair");
      fetchVotingPair();
    } else {
      console.log("Waiting for session ID before fetching voting pair");
    }
  }, [sessionId]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!keyboardEnabled || !votingPair || submitting) return;
      
      if (e.key === "ArrowLeft") {
        // Select left card (card1)
        submitVote(votingPair.card1, votingPair.card2);
      } else if (e.key === "ArrowRight") {
        // Select right card (card2)
        submitVote(votingPair.card2, votingPair.card1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [votingPair, submitting, keyboardEnabled]);

  // Format date to ISO string
  const formatISODate = (date) => {
    return new Date(date).toISOString();
  };

  // Check if session ID is missing after initial load
  useEffect(() => {
    if (!loading && !sessionId) {
      const errorMsg = "Session ID not found. Please refresh the page or clear your browser cache.";
      setError(errorMsg);
      addToast(errorMsg, "error");
    }
  }, [loading, sessionId]);

  if (loading && !votingPair) {
    return <LoadingScreen message="Loading cards for voting..." module="vote" />;
  }

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold">Card Voting</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Choose which card you prefer
            </p>
          </div>
        </motion.div>

        {/* Voting Area */}
        <div className="grid grid-cols-1 gap-8">
          {error ? (
            <div className={`${moduleTheme.lightBg} border ${moduleTheme.borderClass} rounded-lg p-4`}>
              <p className="text-red-800 dark:text-red-200">{error}</p>
              
              {!hasSwipedCards ? (
                <div className="mt-4">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    You need to swipe some cards before you can vote on them! Head to the swipe page to get started.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/swipe">
                      <Button 
                        className="bg-swipe-600 hover:bg-swipe-700 text-white"
                        variant="primary"
                      >
                        Go to Swipe Page 🔄
                      </Button>
                    </Link>
                    <Button 
                      onClick={fetchVotingPair} 
                      className={moduleTheme.buttonClass}
                      variant="secondary"
                    >
                      Check Again
                    </Button>
                  </div>
                </div>
              ) : (
                <Button 
                  onClick={fetchVotingPair} 
                  className={`mt-4 ${moduleTheme.buttonClass}`}
                  variant="primary"
                >
                  Try Again
                </Button>
              )}
            </div>
          ) : votingPair ? (
            <>
              <div className="text-center mb-4">
                <div className={`inline-block px-4 py-2 rounded-full bg-vote-100 text-vote-800 dark:bg-vote-900/30 dark:text-vote-100 text-sm font-medium`}>
                  {votingPair.type === "initial" ? "Initial Ranking 🆕" : 
                   votingPair.type === "ranking" ? "New Card Ranking 🔄" :
                   "Rank Refinement 📊"}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Session ID: {sessionId ? sessionId.substring(0, 8) + '...' : 'Not found'}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Keyboard instructions */}
                <div className="col-span-1 md:col-span-2 text-center mb-2">
                  <p className={`text-sm ${moduleTheme.textClass}`}>
                    Press ← for left card, → for right card
                  </p>
                </div>
                {/* Card 1 */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex flex-col h-full"
                >
                  <Card 
                    className={`p-6 flex flex-col h-full cursor-pointer hover:bg-vote-50/30 dark:hover:bg-vote-900/10 transition-colors border ${moduleTheme.borderClass}`}
                    onClick={() => submitVote(
                      votingPair.card1, 
                      votingPair.card2
                    )}
                  >
                    <div className="flex-1">
                      <p className={`text-lg font-medium mb-4 ${moduleTheme.textClass}`}>
                        {votingPair.card1.text}
                      </p>
                    </div>
                    
                    {votingPair.type !== "initial" && (
                      <div className={`mt-4 pt-4 border-t ${moduleTheme.borderClass}`}>
                        {votingPair.type === "refinement" ? (
                          <p className={`text-sm font-medium ${moduleTheme.textClass}`}>
                            Current Rank: #{votingPair.rank1}
                          </p>
                        ) : (
                          <p className={`text-sm font-medium ${moduleTheme.textClass}`}>
                            New Card 🆕
                          </p>
                        )}
                      </div>
                    )}
                    
                    <div className="mt-6">
                      <Button 
                        className={`w-full ${moduleTheme.buttonClass}`} 
                        disabled={submitting}
                        isLoading={submitting}
                        module="vote"
                      >
                        Select This Card (←)
                      </Button>
                    </div>
                  </Card>
                </motion.div>
                
                {/* Card 2 */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex flex-col h-full"
                >
                  <Card 
                    className={`p-6 flex flex-col h-full cursor-pointer hover:bg-vote-50/30 dark:hover:bg-vote-900/10 transition-colors border ${moduleTheme.borderClass}`}
                    onClick={() => submitVote(
                      votingPair.card2, 
                      votingPair.card1
                    )}
                  >
                    <div className="flex-1">
                      <p className={`text-lg font-medium mb-4 ${moduleTheme.textClass}`}>
                        {votingPair.card2.text}
                      </p>
                    </div>
                    
                    {votingPair.type !== "initial" && (
                      <div className={`mt-4 pt-4 border-t ${moduleTheme.borderClass}`}>
                        {votingPair.type === "refinement" ? (
                          <p className={`text-sm font-medium ${moduleTheme.textClass}`}>
                            Current Rank: #{votingPair.rank2}
                          </p>
                        ) : (
                          <p className={`text-sm font-medium ${moduleTheme.textClass}`}>
                            Current Rank: #{votingPair.currentRank}
                          </p>
                        )}
                      </div>
                    )}
                    
                    <div className="mt-6">
                      <Button 
                        className={`w-full ${moduleTheme.buttonClass}`}
                        disabled={submitting}
                        isLoading={submitting}
                        module="vote"
                      >
                        Select This Card (→)
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              </div>
            </>
          ) : (
            <Card className={`p-6 text-center border ${moduleTheme.borderClass}`}>
              <p className={moduleTheme.textClass}>
                No cards available for voting 🗳️
              </p>
              
              {!hasSwipedCards ? (
                <div className="mt-4">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    You need to swipe right on some cards before you can vote on them. Head to the swipe page to get started!
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <Link href="/swipe">
                      <Button 
                        className="bg-swipe-600 hover:bg-swipe-700 text-white"
                        variant="primary"
                      >
                        Go to Swipe Page 🔄
                      </Button>
                    </Link>
                    <Button 
                      onClick={fetchVotingPair} 
                      className={moduleTheme.buttonClass}
                      variant="secondary"
                    >
                      Check Again
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-xs text-gray-500 mt-2 mb-4">
                    Session ID: {sessionId ? sessionId.substring(0, 8) + '...' : 'Not found'}
                  </div>
                  <Button 
                    onClick={fetchVotingPair} 
                    className={`mt-4 ${moduleTheme.buttonClass}`}
                    variant="primary"
                  >
                    Refresh 🔄
                  </Button>
                </>
              )}
            </Card>
          )}
        </div>

        {/* Vote History */}
        {voteHistory.length > 0 && (
          <div>
            <Card className={`p-6 border ${moduleTheme.borderClass}`}>
              <h2 className={`text-xl font-semibold mb-4 ${moduleTheme.textClass}`}>Recent Votes 🗳️</h2>
              <div className="space-y-3">
                <AnimatePresence>
                  {voteHistory.map((vote, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className={`flex justify-between items-center py-2 border-b ${moduleTheme.borderClass} last:border-0`}
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          <span className="text-vote-600 dark:text-vote-400">✓ {vote.winner.text?.substring(0, 30)}...</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          over <span className="text-vote-300 dark:text-vote-300">{vote.loser.text?.substring(0, 30)}...</span>
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">{formatISODate(vote.timestamp)}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </Card>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
