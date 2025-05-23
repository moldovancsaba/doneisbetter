import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { PageWrapper } from "../components/layout/Header";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { LoadingScreen, LoadingSpinner } from "../components/ui/Loading";
import { useToast } from "../components/ui/Toast";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrophy,
  faArrowUp,
  faArrowDown,
  faChartBar,
  faRedo,
  faArrowLeft
} from "@fortawesome/free-solid-svg-icons";

export default function RankingsPage() {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { addToast } = useToast();

  // Fetch rankings data
  const fetchRankings = async (showRefreshing = false) => {
    if (showRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      const response = await fetch('/api/vote/rankings');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch rankings");
      }
      
      const data = await response.json();
      if (data.success) {
        setRankings(data.data);
      } else {
        throw new Error(data.error || "Failed to fetch rankings");
      }
    } catch (err) {
      setError(err.message);
      addToast(err.message, "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchRankings();
    
    // Set up auto-refresh every 15 minutes
    const refreshInterval = setInterval(() => {
      fetchRankings(true);
    }, 15 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, []);

  // Format relative time (e.g., "2 hours ago")
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffDay > 0) {
      return `${diffDay} ${diffDay === 1 ? 'day' : 'days'} ago`;
    } else if (diffHour > 0) {
      return `${diffHour} ${diffHour === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffMin > 0) {
      return `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`;
    } else {
      return 'Just now';
    }
  };

  // Format date for full timestamp tooltip
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Function to get appropriate badge color based on rank
  const getRankBadgeColor = (rank) => {
    if (rank === 1) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"; // Gold
    if (rank === 2) return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100"; // Silver
    if (rank === 3) return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100"; // Bronze
    return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"; // Default blue
  };

  if (loading && rankings.length === 0) {
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
            <h1 className="text-3xl font-bold">Card Rankings</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              See which cards are winning the most votes
            </p>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={() => router.push('/vote')}
              variant="secondary"
              className="flex items-center space-x-2"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Back to Voting
            </Button>
            
            <Button
              onClick={() => fetchRankings(true)}
              variant="primary"
              isLoading={refreshing}
              disabled={refreshing}
              className="flex items-center space-x-2"
            >
              <FontAwesomeIcon icon={faRedo} className="mr-2" />
              Refresh
            </Button>
          </div>
        </motion.div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {[
            { 
              label: "Total Ranked Cards", 
              value: rankings.length, 
              icon: faChartBar,
              color: "text-blue-500 dark:text-blue-400" 
            },
            { 
              label: "Top Card Win Rate", 
              value: rankings.length > 0 ? rankings[0].winRate : "N/A", 
              icon: faTrophy,
              color: "text-yellow-500 dark:text-yellow-400" 
            },
            { 
              label: "Total Votes Cast", 
              value: rankings.reduce((sum, card) => sum + card.totalVotes, 0), 
              icon: faArrowUp,
              color: "text-green-500 dark:text-green-400" 
            }
          ].map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <FontAwesomeIcon icon={stat.icon} className={`text-3xl ${stat.color}`} />
              </div>
            </Card>
          ))}
        </motion.div>

        {/* Rankings List */}
        <div>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Current Rankings</h2>
            
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                <p className="text-red-800 dark:text-red-200">{error}</p>
                <Button 
                  onClick={() => fetchRankings()} 
                  className="mt-4"
                  variant="secondary"
                >
                  Try Again
                </Button>
              </div>
            )}
            
            {rankings.length === 0 && !loading && !error ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400 mb-4">No ranked cards yet.</p>
                <Link href="/vote">
                  <Button variant="primary">Vote on Cards</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {refreshing && (
                  <div className="flex justify-center items-center py-2">
                    <LoadingSpinner size="sm" />
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Refreshing rankings...</span>
                  </div>
                )}
                
                {rankings.map((card, index) => (
                  <motion.div
                    key={card._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        {/* Rank Badge */}
                        <div className={`flex-shrink-0 w-12 h-12 rounded-full ${getRankBadgeColor(card.rank)} flex items-center justify-center`}>
                          <span className="text-lg font-bold">{card.rank}</span>
                        </div>
                        
                        {/* Card Content */}
                        <div className="flex-1">
                          <p className="text-lg font-medium text-gray-900 dark:text-white">
                            {card.cardText}
                          </p>
                          
                          {/* Stats Grid */}
                          <div className="grid grid-cols-3 gap-2 mt-3">
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Wins</p>
                              <p className="text-base font-semibold">{card.wins}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Total Votes</p>
                              <p className="text-base font-semibold">{card.totalVotes}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Win Rate</p>
                              <p className="text-base font-semibold">{card.winRate}</p>
                            </div>
                          </div>
                          
                          {/* Last Updated */}
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2" title={formatDate(card.lastUpdated)}>
                            Last updated: {formatRelativeTime(card.lastUpdated)}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}

