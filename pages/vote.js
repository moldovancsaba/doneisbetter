import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { PageWrapper } from "../components/layout/PageWrapper";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { LoadingScreen } from "../components/ui/Loading";
import { useToast } from "../components/ui/Toast";
import { motion, AnimatePresence } from "framer-motion";
import { useModuleTheme } from "../contexts/ModuleThemeContext";
import { useSession } from "../contexts/SessionContext";
import InfoMessage from "../components/ui/InfoMessage";

export default function VotePage() {
  const [votingPair, setVotingPair] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [voteHistory, setVoteHistory] = useState([]);
  const [error, setError] = useState(null);
  const { addToast } = useToast();
  const [keyboardEnabled, setKeyboardEnabled] = useState(true);
  const [hasSwipedCards, setHasSwipedCards] = useState(true);
  const { theme: moduleTheme } = useModuleTheme();
  const { 
    sessionId,
    userId,
    status: sessionStatus,
    error: sessionError,
    isRegistered,
    refreshSession,
    formatISO
  } = useSession();
  
  // Helper function to safely extract card ID
  const getCardId = useCallback((card) => {
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
  }, []);

  // Check if user has swiped cards
  const checkUserHasSwipedCards = useCallback(async () => {
    if (!sessionId) {
      console.error("Cannot check swiped cards without sessionId");
      setError("Session ID is required. Please refresh the page.");
      return false;
    }
    
    try {
      console.log(`Checking swiped cards for session: ${sessionId}`);
      const url = `/api/user-votes?sessionId=${encodeURIComponent(sessionId)}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch user votes");
      }
      
      const data = await response.json();
      console.log("User votes response:", data);
      
      // Check if user has right-swiped cards
      const hasRightSwipes = data.success && Array.isArray(data.data) && data.data.length > 0;
      
      if (!hasRightSwipes) {
        setError("You need to swipe right on some cards before you can vote! Head to the swipe page to get started.");
        return false;
      }
      
      console.log(`User has ${data.data.length} right-swiped cards available for voting`);
      return true;
    } catch (err) {
      console.error("Error checking swiped cards:", err);
      setError(`Failed to check swiped cards: ${err.message}`);
      return false;
    }
  }, [sessionId, setError]);

  // Fetch a new pair of cards for voting
  const fetchVotingPair = useCallback(async () => {
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
  }, [sessionId, addToast, checkUserHasSwipedCards, setLoading, setError, setHasSwipedCards, setVotingPair, getCardId]);

  // Submit vote
  const submitVote = useCallback(async (winningCard, losingCard) => {
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
        sessionId: sessionId,
        ...(userId && { userId }), // Add userId if available
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
  }, [sessionId, addToast, getCardId, votingPair, setVoteHistory, fetchVotingPair, submitting, userId]);


  // Initial fetch - only after session is active
  useEffect(() => {
    if (sessionStatus === 'active' && sessionId && isRegistered) {
      console.log("Session active, fetching initial voting pair");
      fetchVotingPair();
    } else {
      console.log("Waiting for active session before fetching voting pair");
    }
  }, [sessionStatus, sessionId, isRegistered, fetchVotingPair]);

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
  }, [votingPair, submitting, keyboardEnabled, submitVote]);

  // Format date to ISO string
  const formatISODate = (date) => {
    return new Date(date).toISOString();
  };


  if (sessionStatus === 'initializing' || sessionStatus === 'error' || !sessionId) {
    return (
      <PageWrapper>
        <div className="container-responsive py-4 sm:py-6">
          <InfoMessage
            type={sessionStatus === 'error' ? "error" : "info"}
            title={sessionStatus === 'error' ? "Session Error" : "Initializing Session"}
            message={sessionStatus === 'error' 
              ? `${sessionError || 'Failed to initialize session'}`
              : "Preparing your voting session..."}
            module="vote"
            className={`border ${moduleTheme.borderClass}`}
          />
        </div>
      </PageWrapper>
    );
  }

  if (loading && !votingPair) {
    return (
      <PageWrapper>
        <div className="max-w-4xl mx-auto p-4">
          <InfoMessage
            type="info"
            title="Loading Vote Cards"
            message="Loading cards for voting..."
            module="vote"
            className={`border ${moduleTheme.borderClass}`}
          />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="container-responsive space-y-6 sm:space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-vote-500 to-vote-700">Card Voting 🗳️</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Choose which card you prefer
            </p>
          </div>
        </motion.div>

        {/* Voting Area */}
        <div className="grid grid-cols-1 gap-8">
          {error ? (
            <div className="space-y-4">
                <InfoMessage
                  type={!hasSwipedCards ? "info" : "error"}
                  title={!hasSwipedCards ? "New here? Let's get started!" : "Error Loading Vote Cards"}
                  message={
                    !hasSwipedCards
                      ? "You&apos;ll need to swipe right on at least two cards before you can start voting. Head over to the Swipe section to get started!"
                      : error
                  }
                  action={true}
                  actionLabel={!hasSwipedCards ? "Start Swiping 🔄" : "Try Again"}
                  actionLink={!hasSwipedCards ? "/swipe" : null}
                  onAction={!hasSwipedCards ? null : fetchVotingPair}
                  module="vote"
                  className={`border ${moduleTheme.borderClass}`}
                />
              
              {!hasSwipedCards && (
                <Card className={`p-4 border ${moduleTheme.borderClass}`}>
                  <h3 className="text-lg font-medium mb-2">How Voting Works:</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300">
                    <li>First, swipe right on cards you like in the Swipe section</li>
                    <li>Once you&apos;ve liked at least two cards, you can start voting</li>
                    <li>Your votes help determine the overall rankings</li>
                  </ol>
                </Card>
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
            <div className="space-y-4">
              <InfoMessage
                type={!hasSwipedCards ? "info" : "warning"}
                title="No Cards Available for Voting"
                message={
                  !hasSwipedCards
                    ? "Welcome! To get started with voting, first head to the Swipe section and swipe right on cards you&apos;d like to rank. You&apos;ll need at least two liked cards to begin voting."
                    : "No cards are currently available for voting. Try refreshing or add more cards to your liked list by visiting the Swipe section."
                }
                action={true}
                actionLabel={!hasSwipedCards ? "Start Swiping 🔄" : "Refresh 🔄"}
                actionLink={!hasSwipedCards ? "/swipe" : null}
                onAction={!hasSwipedCards ? null : fetchVotingPair}
                module="vote"
                className={`border ${moduleTheme.borderClass}`}
              />
              
              {!hasSwipedCards && (
                <Card className={`p-4 border ${moduleTheme.borderClass}`}>
                  <h3 className="text-lg font-medium mb-2">Getting Started:</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300">
                    <li>Visit the Swipe section to discover cards</li>
                    <li>Swipe right on cards you&apos;re interested in ranking</li>
                    <li>Return here once you&apos;ve liked at least two cards</li>
                  </ol>
                </Card>
              )}
              
              <div className="text-center text-xs text-gray-500">
                Session ID: {sessionId ? sessionId.substring(0, 8) + '...' : 'Not found'}
              </div>
            </div>
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
