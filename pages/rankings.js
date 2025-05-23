import { useState, useEffect, useCallback } from "react";
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
  faArrowLeft,
  faUser,
  faGlobe,
  faExchangeAlt,
  faIdCard,
  faClock,
  faThumbsUp,
  faThumbsDown,
  faCircle
} from "@fortawesome/free-solid-svg-icons";

export default function RankingsPage() {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('personal'); // 'global' or 'personal'
  const [sessionId, setSessionId] = useState(null);
  const [personalRankings, setPersonalRankings] = useState([]);
  const [loadingPersonal, setLoadingPersonal] = useState(false);
  const [remountKey, setRemountKey] = useState(Date.now()); // Force remount key
  const [lastVisitedPage, setLastVisitedPage] = useState(null);
  const router = useRouter();
  const { addToast } = useToast();

  // Get or create session ID
  useEffect(() => {
    // Try to get existing session ID from localStorage
    const storedSessionId = localStorage.getItem('voteSessionId');
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      // Create a new random session ID using a timestamp and random number
      const newSessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('voteSessionId', newSessionId);
      setSessionId(newSessionId);
    }
  }, []);

  // Fetch global rankings data
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
  
  // Fetch personal rankings data (cards the user has voted on)
  const fetchPersonalRankings = async (showRefreshing = false) => {
    if (!sessionId) {
      console.error("No session ID available, cannot fetch personal rankings");
      addToast("Session ID not found. Your votes may not be tracked correctly.", "error");
      return;
    }
    
    // Update loading state with visual feedback
    if (showRefreshing) {
      setRefreshing(true);
      addToast("Refreshing your rankings...", "info");
    } else {
      setLoadingPersonal(true);
    }
    
    console.log(`Fetching personal rankings with sessionId: ${sessionId}, timestamp: ${new Date().toISOString()}`);
    
    try {
      // Clear any previous errors
      setError(null);
      
      const endpoint = `/api/user-votes?sessionId=${encodeURIComponent(sessionId)}`;
      console.log(`Making fetch request to: ${endpoint}`);
      
      const response = await fetch(endpoint);
      console.log(`Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch personal rankings: HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Personal rankings data received, success: ${data.success}, items: ${data.data?.length || 0}`);
      
      if (data.success) {
        // Add vote status to each card (liked, disliked, or not voted)
        const rankedCards = Array.isArray(data.data) ? data.data.map(card => ({
          ...card,
          voteStatus: card.wins > 0 ? 'liked' : 'disliked'
        })) : [];
        
        console.log(`Processed ${rankedCards.length} personal ranking cards`);
        setPersonalRankings(rankedCards);
        
        if (rankedCards.length === 0) {
          console.log("No personal rankings found, but request was successful");
          if (showRefreshing) {
            addToast("No voted cards found. Try voting on some cards first!", "info");
          }
        } else {
          if (showRefreshing) {
            addToast(`Successfully loaded ${rankedCards.length} voted cards`, "success");
          }
        }
      } else {
        throw new Error(data.error || "Failed to fetch personal rankings: Unknown error");
      }
    } catch (err) {
      console.error("Error fetching personal rankings:", err);
      setError(`Failed to fetch your rankings: ${err.message}`);
      addToast(`Error loading your rankings: ${err.message}`, "error");
    } finally {
      setLoadingPersonal(false);
      setRefreshing(false);
      console.log("Personal rankings fetch completed at:", new Date().toISOString());
    }
  };

  // Memoized refresh function to avoid recreating on every render
  const refreshData = useCallback(() => {
    if (sessionId) {
      console.log(`Refreshing data with sessionId: ${sessionId}`);
      if (viewMode === 'personal') {
        fetchPersonalRankings(true);
      } else {
        fetchRankings(true);
      }
      // Force remount to ensure fresh UI
      setRemountKey(Date.now());
    }
  }, [sessionId, viewMode]);

  // Handle navigation events (detect returns from voting page)
  useEffect(() => {
    const handleRouteChange = (url) => {
      setLastVisitedPage(url);
    };
    
    const handleRouteComplete = (url) => {
      // If we're coming back from the voting page to rankings
      if (url === '/rankings' && lastVisitedPage === '/vote') {
        console.log('Returned from voting page, refreshing data...');
        // Small delay to ensure data is updated on the server
        setTimeout(refreshData, 500);
      }
    };

    router.events.on('routeChangeStart', handleRouteChange);
    router.events.on('routeChangeComplete', handleRouteComplete);
    
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
      router.events.off('routeChangeComplete', handleRouteComplete);
    };
  }, [router.events, lastVisitedPage, refreshData]);
  
  // Add window focus event to refresh data when tab becomes active
  useEffect(() => {
    const handleFocus = () => {
      console.log('Window focused, refreshing data...');
      refreshData();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [refreshData]);

  // Fetch both global and personal rankings when sessionId is available
  useEffect(() => {
    if (sessionId) {
      console.log(`Session ID available (${sessionId}), fetching rankings...`);
      
      // First fetch global rankings
      fetchRankings().then(() => {
        console.log("Global rankings fetched, now fetching personal rankings");
        // Then fetch personal rankings to ensure they're both available
        fetchPersonalRankings();
      }).catch(err => {
        console.error("Error in initial rankings fetch sequence:", err);
        // Still try to fetch personal rankings even if global fails
        fetchPersonalRankings();
      });
    } else {
      console.log("No session ID available yet, waiting before fetching rankings");
    }
  }, [sessionId]);
  
  // Switch between global and personal rankings
  const toggleViewMode = () => {
    const newMode = viewMode === 'global' ? 'personal' : 'global';
    setViewMode(newMode);
    
    // Always refetch when switching views for freshest data
    if (newMode === 'personal') {
      console.log("Switching to personal view, fetching fresh personal rankings");
      fetchPersonalRankings(true);
    } else {
      console.log("Switching to global view, fetching fresh global rankings");
      fetchRankings(true);
    }
  };
  
  // Calculate KPI statistics for current view
  const personalStats = {
    rankedCards: personalRankings.length,
    topWinRate: personalRankings.length > 0 
      ? Math.max(...personalRankings.map(card => card.winRate))
      : 0,
    totalVotes: personalRankings.reduce((sum, card) => sum + card.totalVotes, 0)
  };
  
  const globalStats = {
    totalCards: rankings.length,
    topWinRate: rankings.length > 0 
      ? Math.max(...rankings.map(card => card.winRate))
      : 0,
    totalVotes: rankings.reduce((sum, card) => sum + card.totalVotes, 0)
  };

  // Format date to ISO 8601 with milliseconds
  const formatISODate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      // Format as ISO 8601 with milliseconds: 2025-04-13T12:34:56.789Z
      return new Date(dateString).toISOString();
    } catch (err) {
      console.error("Error formatting date:", err);
      return "Invalid Date";
    }
  };

  // Function to get appropriate badge color based on rank
  const getRankBadgeColor = (rank) => {
    if (rank === 1) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"; // Gold
    if (rank === 2) return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100"; // Silver
    if (rank === 3) return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100"; // Bronze
    return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"; // Default blue
  };
  
  // Function to get vote status indicator color and icon
  const getVoteStatusIndicator = (status) => {
    switch (status) {
      case 'liked':
        return { color: "text-green-500", bgColor: "bg-green-500", icon: faThumbsUp };
      case 'disliked':
        return { color: "text-red-500", bgColor: "bg-red-500", icon: faThumbsDown };
      default:
        return { color: "text-gray-400", bgColor: "bg-gray-400", icon: faCircle };
    }
  };

  // Show loading screen while initial data is loading
  if ((viewMode === 'global' && loading && rankings.length === 0) || 
      (viewMode === 'personal' && loadingPersonal && personalRankings.length === 0)) {
    return (
      <LoadingScreen 
        message={`Loading ${viewMode === 'global' ? 'global' : 'personal'} rankings...`} 
        subMessage={sessionId ? `Using session ID: ${sessionId.substring(0, 8)}...` : "Initializing session..."}
      />
    );
  }

  return (
    <PageWrapper key={remountKey}>
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
              {viewMode === 'global' 
                ? 'See which cards are winning the most votes'
                : 'Cards you have voted on'
              }
            </p>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={() => router.push('/vote')}
              variant="secondary"
              className="flex items-center"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Back to Voting
            </Button>
            
            <Button
              onClick={toggleViewMode}
              variant="secondary"
              className="flex items-center"
            >
              <FontAwesomeIcon 
                icon={viewMode === 'global' ? faUser : faGlobe} 
                className="mr-2" 
              />
              {viewMode === 'global' ? 'My Rankings' : 'Global Rankings'}
            </Button>
            
            <Button
              onClick={refreshData}
              variant="primary"
              isLoading={refreshing}
              disabled={refreshing}
              className="flex items-center"
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
              label: viewMode === 'global' ? "Total Ranked Cards" : "Your Ranked Cards", 
              value: viewMode === 'global' ? globalStats.totalCards : personalStats.rankedCards, 
              icon: faChartBar,
              color: "text-blue-500 dark:text-blue-400" 
            },
            { 
              label: "Top Card Win Rate", 
              value: viewMode === 'global' 
                ? (globalStats.topWinRate > 0 ? `${globalStats.topWinRate}%` : "N/A")
                : (personalStats.topWinRate > 0 ? `${personalStats.topWinRate}%` : "N/A"), 
              icon: faTrophy,
              color: "text-yellow-500 dark:text-yellow-400" 
            },
            { 
              label: "Total Votes Cast", 
              value: viewMode === 'global'
                ? globalStats.totalVotes
                : personalStats.totalVotes, 
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
            <h2 className="text-xl font-semibold mb-4">
              {viewMode === 'global' ? 'Global Rankings' : 'Your Personal Rankings'}
            </h2>
            
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
            
            {viewMode === 'global' ? (
              rankings.length === 0 && !loading && !error ? (
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
                            <div className="flex flex-col">
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Card ID: {card._id}
                              </p>
                              <p className="text-lg font-medium text-gray-900 dark:text-white mt-1">
                                Card Name: {card.cardText}
                              </p>
                              
                              <div className="flex items-end justify-end mt-1">
                                {/* Like/Dislike Counts */}
                                <div className="flex items-center space-x-3">
                                  <div className="flex items-center">
                                    <FontAwesomeIcon icon={faThumbsUp} className="text-green-500 mr-1" />
                                    <span className="text-sm font-medium">{card.wins}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <FontAwesomeIcon icon={faThumbsDown} className="text-red-500 mr-1" />
                                    <span className="text-sm font-medium">{card.totalVotes - card.wins}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
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
                                <p className="text-base font-semibold">{card.winRate}%</p>
                              </div>
                            </div>
                            
                            {/* Last Updated */}
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                              Last updated: {formatISODate(card.lastUpdated)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Created: {formatISODate(card.createdAt)}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )
            ) : (
              personalRankings.length === 0 && !loadingPersonal && !error ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    {sessionId 
                      ? "You haven't voted on any cards yet or your votes haven't been recorded." 
                      : "Session ID not found. Your votes may not be tracked correctly."}
                  </p>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    <p>If you've recently voted but don't see your rankings:</p>
                    <ul className="list-disc list-inside mt-2 mx-auto max-w-md text-left">
                      <li>Try refreshing the rankings using the button below</li>
                      <li>Check that you're using the same browser session as when you voted</li>
                      <li>Your session ID: <span className="font-mono">{sessionId ? sessionId.substring(0, 12) + '...' : 'Not found'}</span></li>
                      <li>Last check time: <span className="font-mono">{new Date().toISOString()}</span></li>
                    </ul>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <Link href="/vote">
                      <Button variant="primary">
                        <FontAwesomeIcon icon={faExchangeAlt} className="mr-2" />
                        Go Vote on Cards
                      </Button>
                    </Link>
                    <Button 
                      variant="secondary" 
                      onClick={refreshData}
                      isLoading={refreshing}
                    >
                      <FontAwesomeIcon icon={faRedo} className="mr-2" />
                      Refresh Rankings
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {refreshing && (
                    <div className="flex justify-center items-center py-2">
                      <LoadingSpinner size="sm" />
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Refreshing your rankings...</span>
                    </div>
                  )}
                  
                  {personalRankings.map((card, index) => (
                    <motion.div
                      key={card._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          {/* Vote Status Indicator */}
                          <div className={`flex-shrink-0 w-12 h-12 rounded-full ${getVoteStatusIndicator(card.voteStatus).bgColor} flex items-center justify-center`}>
                            <FontAwesomeIcon icon={getVoteStatusIndicator(card.voteStatus).icon} className="text-white" />
                          </div>
                          
                          {/* Card Content */}
                          <div className="flex-1">
                            <div className="flex flex-col">
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Card ID: {card._id}
                              </p>
                              <p className="text-lg font-medium text-gray-900 dark:text-white mt-1">
                                Card Name: {card.cardText}
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
                                  <p className="text-base font-semibold">{card.winRate}%</p>
                                </div>
                              </div>
                              
                              {/* Last Updated */}
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                Last updated: {formatISODate(card.lastUpdated)}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Created: {formatISODate(card.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )
            )}
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}

