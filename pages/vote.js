import { useState, useEffect } from "react";
import Link from "next/link";
import { PageWrapper } from "../components/layout/Header";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { LoadingScreen } from "../components/ui/Loading";
import { useToast } from "../components/ui/Toast";
import { motion, AnimatePresence } from "framer-motion";

export default function VotePage() {
  const [votingPair, setVotingPair] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [voteHistory, setVoteHistory] = useState([]);
  const [error, setError] = useState(null);
  const { addToast } = useToast();

  // Fetch a new pair of cards for voting
  const fetchVotingPair = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/vote/pair');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch voting pair");
      }
      
      const data = await response.json();
      if (data.success) {
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
  const submitVote = async (winningCardId, losingCardId) => {
    if (submitting) return;
    
    setSubmitting(true);
    try {
      const response = await fetch('/api/vote/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: votingPair.sessionId,
          winnerId: winningCardId,
          loserId: losingCardId,
          type: votingPair.type
        }),
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
            winner: votingPair.card1._id === winningCardId ? votingPair.card1 : votingPair.card2,
            loser: votingPair.card1._id === losingCardId ? votingPair.card1 : votingPair.card2,
            timestamp: new Date()
          },
          ...prev.slice(0, 9) // Keep last 10 votes
        ]);
        
        addToast("Vote submitted successfully", "success");
        
        // Fetch a new pair
        fetchVotingPair();
      } else {
        throw new Error(data.error || "Failed to submit vote");
      }
    } catch (err) {
      setError(err.message);
      addToast(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchVotingPair();
  }, []);

  // Format date
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && !votingPair) {
    return <LoadingScreen />;
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

          <div className="flex space-x-3">
            <Link href="/rankings" className="inline-block">
              View Rankings
            </Link>
          </div>
        </motion.div>

        {/* Voting Area */}
        <div className="grid grid-cols-1 gap-8">
          {error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-200">{error}</p>
              <Button 
                onClick={fetchVotingPair} 
                className="mt-4"
                variant="secondary"
              >
                Try Again
              </Button>
            </div>
          ) : votingPair ? (
            <>
              <div className="text-center mb-4">
                <div className="inline-block px-4 py-2 rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-100 text-sm font-medium">
                  {votingPair.type === "initial" ? "Initial Ranking" : 
                   votingPair.type === "ranking" ? "New Card Ranking" :
                   "Rank Refinement"}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card 1 */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex flex-col h-full"
                >
                  <Card 
                    className="p-6 flex flex-col h-full cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                    onClick={() => submitVote(
                      votingPair.card1._id || votingPair.card1, 
                      votingPair.card2._id || votingPair.card2
                    )}
                  >
                    <div className="flex-1">
                      <p className="text-lg font-medium mb-4">
                        {votingPair.card1.text}
                      </p>
                    </div>
                    
                    {votingPair.type !== "initial" && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        {votingPair.type === "refinement" ? (
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            Current Rank: #{votingPair.rank1}
                          </p>
                        ) : (
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            New Card
                          </p>
                        )}
                      </div>
                    )}
                    
                    <div className="mt-6">
                      <Button 
                        className="w-full" 
                        disabled={submitting}
                        isLoading={submitting}
                      >
                        Select This Card
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
                    className="p-6 flex flex-col h-full cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                    onClick={() => submitVote(
                      votingPair.card2._id || votingPair.card2, 
                      votingPair.card1._id || votingPair.card1
                    )}
                  >
                    <div className="flex-1">
                      <p className="text-lg font-medium mb-4">
                        {votingPair.card2.text}
                      </p>
                    </div>
                    
                    {votingPair.type !== "initial" && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        {votingPair.type === "refinement" ? (
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            Current Rank: #{votingPair.rank2}
                          </p>
                        ) : (
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            Current Rank: #{votingPair.currentRank}
                          </p>
                        )}
                      </div>
                    )}
                    
                    <div className="mt-6">
                      <Button 
                        className="w-full" 
                        disabled={submitting}
                        isLoading={submitting}
                      >
                        Select This Card
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              </div>
            </>
          ) : (
            <Card className="p-6 text-center">
              <p className="text-gray-600 dark:text-gray-300">
                No cards available for voting. Try again later.
              </p>
              <Button 
                onClick={fetchVotingPair} 
                className="mt-4"
                variant="secondary"
              >
                Refresh
              </Button>
            </Card>
          )}
        </div>

        {/* Vote History */}
        {voteHistory.length > 0 && (
          <div>
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Votes</h2>
              <div className="space-y-3">
                <AnimatePresence>
                  {voteHistory.map((vote, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-0"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          <span className="text-green-600 dark:text-green-400">✓ {vote.winner.text?.substring(0, 30)}...</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          over <span className="text-red-500 dark:text-red-400">{vote.loser.text?.substring(0, 30)}...</span>
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">{formatTime(vote.timestamp)}</span>
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
