import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { PageWrapper } from "../components/layout/Header";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { LoadingScreen, LoadingSpinner, ModuleSkeleton } from "../components/ui/Loading";
import { useToast } from "../components/ui/Toast";
import { motion } from "framer-motion";
import { useModuleTheme } from "../contexts/ModuleThemeContext";
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
  const { theme: moduleTheme } = useModuleTheme();

  // Get or create session ID
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
    
    // Add listener to track session ID changes
    const handleStorageChange = (e) => {
      if (e.key === 'voteSessionId' && e.newValue !== sessionId) {
        console.log("Session ID changed in another tab, updating");
        setSessionId(e.newValue);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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
    // Add a unique request ID to track this specific request through logs
    const requestId = Math.random().toString(36).substring(2, 10);
    console.log(`[${requestId}] BEGIN fetchPersonalRankings`, {
      timestamp: new Date().toISOString(),
      showRefreshing
    });
    
    if (!sessionId) {
      console.error(`[${requestId}] No session ID available, cannot fetch personal rankings`);
      addToast("Session ID not found. Your votes may not be tracked correctly.", "error");
      setError("Session ID is required to view your personal rankings");
      setLoadingPersonal(false);
      return;
    }
    
    // Update loading state with visual feedback
    if (showRefreshing) {
      setRefreshing(true);
      addToast("Refreshing your rankings...", "info");
    } else {
      setLoadingPersonal(true);
    }
    
    console.log(`[${requestId}] Fetching personal rankings with sessionId: ${sessionId}, timestamp: ${new Date().toISOString()}`);
    
    // Add debug information to the page for easier debugging
    window._debug = window._debug || {};
    window._debug.lastRequestId = requestId;
    window._debug.sessionId = sessionId;
    
    try {
      // Clear any previous errors
      setError(null);
      
      // Ensure we're using the latest session ID
      const currentSessionId = localStorage.getItem('voteSessionId');
      const effectiveSessionId = currentSessionId || sessionId;
      
      if (currentSessionId !== sessionId) {
        console.warn("Session ID mismatch. Using more recent ID from localStorage.");
        setSessionId(currentSessionId);
      }
      
      const endpoint = `/api/user-votes?sessionId=${encodeURIComponent(effectiveSessionId)}`;
      console.log(`Making fetch request to: ${endpoint}`);
      
      // Add a timeout to handle hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      console.log(`[${requestId}] Sending fetch request to: ${endpoint}`);
      
      const response = await fetch(endpoint, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'x-request-id': requestId
        }
      });
      
      // Clear timeout since we got a response
      clearTimeout(timeoutId);
      
      console.log(`[${requestId}] Response received, status: ${response.status}, ok: ${response.ok}`);
      console.log(`[${requestId}] Response headers:`, {
        contentType: response.headers.get('content-type'),
        contentLength: response.headers.get('content-length')
      });
    
      if (!response.ok) {
        // Try to get more detailed error information
        let errorText;
        let errorData = {};
        
        try {
          // Get raw response text first for debugging
          errorText = await response.text();
          console.log(`[${requestId}] Error response raw text:`, errorText);
          
          // Try to parse as JSON if possible
          try {
            errorData = JSON.parse(errorText);
            console.log(`[${requestId}] Parsed error data:`, errorData);
          } catch (parseError) {
            console.error(`[${requestId}] Failed to parse error response as JSON:`, parseError);
          }
        } catch (textError) {
          console.error(`[${requestId}] Failed to get response text:`, textError);
        }
        
        throw new Error(errorData.error || `Failed to fetch personal rankings: HTTP ${response.status}`);
      }
      
      // Get raw response text first for debugging
      const responseText = await response.text();
      console.log(`[${requestId}] Raw response text (first 500 chars):`, responseText.substring(0, 500));
      
      // Parse the JSON response
      let data;
      try {
        data = JSON.parse(responseText);
        console.log(`[${requestId}] Personal rankings data received:`, {
          success: data.success,
          itemCount: data.data?.length || 0,
          timestamp: data.timestamp
        });
        
        // Store in debug object
        window._debug.lastResponse = data;
      } catch (parseError) {
        console.error(`[${requestId}] Failed to parse response as JSON:`, parseError);
        throw new Error(`Failed to parse API response: ${parseError.message}`);
      }
      
      if (data.success) {
        // Verify that we have a data array
        if (!Array.isArray(data.data)) {
          console.error(`[${requestId}] Response data is not an array:`, data);
          throw new Error("Invalid response format: expected an array of cards");
        }
        
        console.log(`[${requestId}] Data structure validation:`, {
          isDataArray: Array.isArray(data.data),
          dataLength: data.data.length,
          firstItem: data.data.length > 0 ? Object.keys(data.data[0]) : 'empty'
        });
        
        // Add vote status to each card (right-swiped cards are "liked")
        const rankedCards = data.data.map((card, index) => {
          // Log the first few cards for debugging
          if (index < 3) {
            console.log(`[${requestId}] Card ${index} data:`, card);
          }
          
          return {
            ...card,
            voteStatus: 'liked', // All cards are right-swiped (wasSwipedRight should be true)
            wasSwipedRight: true // Ensure this field is present
          };
        });
        
        console.log(`[${requestId}] Processed ${rankedCards.length} personal ranking cards`);
        if (rankedCards.length > 0) {
          console.log(`[${requestId}] First card example:`, {
            id: rankedCards[0]._id,
            text: rankedCards[0].cardText,
            voteStatus: rankedCards[0].voteStatus,
            wasSwipedRight: rankedCards[0].wasSwipedRight
          });
        } else {
          console.log(`[${requestId}] No cards found in response`);
        }
        
        setPersonalRankings(rankedCards);
        
        if (rankedCards.length === 0) {
          console.log("No personal rankings found, but request was successful");
          if (showRefreshing) {
            addToast("No cards found. Try swiping right on some cards first!", "info");
          }
        } else {
          if (showRefreshing) {
            addToast(`Successfully loaded ${rankedCards.length} cards you've liked`, "success");
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
      
      // Add this information to the global window object for debugging
      window._debug = window._debug || {};
      window._debug.isSessionAvailable = true;
      window._debug.sessionIdValue = sessionId;
      
      // First fetch global rankings
      fetchRankings()
        .then(() => {
          console.log("Global rankings fetched successfully");
          
          // Delay slightly to ensure any background processing completes
          setTimeout(() => {
            console.log("Starting personal rankings fetch after global rankings");
            // Then fetch personal rankings to ensure they're both available
            fetchPersonalRankings();
          }, 500);
        })
        .catch(err => {
          console.error("Error in initial rankings fetch sequence:", err);
          // Still try to fetch personal rankings even if global fails
          console.log("Global rankings fetch failed, still trying personal rankings");
          
          // Add short delay before trying personal rankings
          setTimeout(() => {
            fetchPersonalRankings();
          }, 500);
        });
    } else {
      console.log("No session ID available yet, waiting before fetching rankings");
      window._debug = window._debug || {};
      window._debug.isSessionAvailable = false;
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
      console.error("Error formatting date:", err, "Original value:", dateString);
      return "Invalid Date";
    }
  };
  
  // Add a debug button to expose current state values
  const showDebugInfo = () => {
    console.group("Rankings Page Debug Info");
    console.log("Current view mode:", viewMode);
    console.log("Session ID:", sessionId);
    console.log("Personal rankings count:", personalRankings.length);
    console.log("Global rankings count:", rankings.length);
    console.log("Loading states:", { loading, loadingPersonal, refreshing });
    console.log("Error state:", error);
    console.groupEnd();
    
    addToast("Debug info logged to console", "info");
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
        module="rankings"
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
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rankings-500 to-rankings-700">Rankings 🏆</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {viewMode === 'global' 
                ? 'See which cards are winning the most votes'
                : 'Cards you have liked (swiped right on)'
              }
            </p>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={() => router.push('/vote')}
              variant="secondary"
              className={`flex items-center border-rankings-200 dark:border-rankings-800 hover:bg-rankings-50 dark:hover:bg-rankings-900/20`}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Back to Voting 🗳️
            </Button>
            
            <Button
              onClick={toggleViewMode}
              variant="secondary"
              className={`flex items-center border-rankings-200 dark:border-rankings-800 hover:bg-rankings-50 dark:hover:bg-rankings-900/20`}
            >
              <FontAwesomeIcon 
                icon={viewMode === 'global' ? faUser : faGlobe} 
                className={`mr-2 text-rankings-500 dark:text-rankings-400`} 
              />
              {viewMode === 'global' ? 'My Rankings 👤' : 'Global Rankings 🌐'}
            </Button>
            
            <Button
              onClick={refreshData}
              variant="primary"
              isLoading={refreshing}
              disabled={refreshing}
              className={`flex items-center bg-rankings-600 hover:bg-rankings-700 text-white`}
            >
              <FontAwesomeIcon icon={faRedo} className="mr-2" />
              Refresh
            </Button>
            
            {/* Hidden debug button - only visible in development */}
            {process.env.NODE_ENV !== 'production' && (
              <Button
                onClick={showDebugInfo}
                variant="secondary"
                className="ml-2 border-gray-200 dark:border-gray-700 text-xs"
                size="sm"
              >
                Debug
              </Button>
            )}
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
              color: "text-rankings-500 dark:text-rankings-400" 
            },
            { 
              label: "Top Card Win Rate", 
              value: viewMode === 'global' 
                ? (globalStats.topWinRate > 0 ? `${globalStats.topWinRate}%` : "N/A")
                : (personalStats.topWinRate > 0 ? `${personalStats.topWinRate}%` : "N/A"), 
              icon: faTrophy,
              color: "text-rankings-600 dark:text-rankings-500" 
            },
            { 
              label: "Total Votes Cast", 
              value: viewMode === 'global'
                ? globalStats.totalVotes
                : personalStats.totalVotes, 
              icon: faArrowUp,
              color: "text-rankings-700 dark:text-rankings-600" 
            }
          ].map((stat, index) => (
            <Card key={index} className={`p-6 border ${moduleTheme.borderClass} hover:shadow-md transition-shadow duration-200`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className={`text-3xl font-bold mt-1 ${moduleTheme.textClass}`}>{stat.value}</p>
                </div>
                <FontAwesomeIcon icon={stat.icon} className={`text-3xl ${stat.color}`} />
              </div>
            </Card>
          ))}
        </motion.div>

        {/* Rankings List */}
        <div>
          <Card className={`p-6 border ${moduleTheme.borderClass}`}>
            <h2 className={`text-xl font-semibold mb-4 ${moduleTheme.textClass}`}>
              {viewMode === 'global' ? 'Global Rankings 🌐' : 'Your Personal Rankings 👤'}
            </h2>
            
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                <p className="text-red-800 dark:text-red-200">{error}</p>
                <p className="text-gray-600 dark:text-gray-300 mt-2 mb-2">
                  New here? You might need to swipe or vote on some cards first before you can see your rankings.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <Button 
                    onClick={() => fetchRankings()} 
                    className={`${moduleTheme.buttonClass}`}
                    variant="primary"
                  >
                    Try Again
                  </Button>
                  <Link href="/swipe">
                    <Button 
                      className={`bg-swipe-600 hover:bg-swipe-700 text-white`}
                      variant="primary"
                    >
                      Go to Swipe Page 🔄
                    </Button>
                  </Link>
                </div>
              </div>
            )}
            
            {viewMode === 'global' ? (
              rankings.length === 0 && !loading && !error ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">No ranked cards yet.</p>
                  <Link href="/vote">
                    <Button className={moduleTheme.buttonClass} variant="primary">Vote on Cards 🗳️</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {refreshing && (
                    <div className="flex justify-center items-center py-2">
                      <LoadingSpinner size="sm" module="rankings" />
                      <span className={`ml-2 text-sm ${moduleTheme.textClass}`}>Refreshing rankings... 🔄</span>
                    </div>
                  )}
                  
                  {rankings.map((card, index) => (
                    <motion.div
                      key={card._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className={`p-4 hover:bg-rankings-50/30 dark:hover:bg-rankings-900/10 border ${moduleTheme.borderClass} transition-colors duration-200`}>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          {/* Rank Badge */}
                          <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-rankings-${Math.min(card.rank, 5)}00/80 text-white flex items-center justify-center`}>
                            <span className="text-lg font-bold">{card.rank}</span>
                          </div>
                          
                          {/* Card Content */}
                          <div className="flex-1">
                            <div className="flex flex-col">
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Card ID: {card._id}
                              </p>
                              <p className={`text-lg font-medium ${moduleTheme.textClass} mt-1`}>
                                {card.cardText}
                              </p>
                              
                              <div className="flex items-end justify-end mt-1">
                                {/* Like/Dislike Counts */}
                                <div className="flex items-center space-x-3">
                                  <div className="flex items-center">
                                    <FontAwesomeIcon icon={faThumbsUp} className="text-rankings-500 mr-1" />
                                    <span className="text-sm font-medium">{card.wins}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <FontAwesomeIcon icon={faThumbsDown} className="text-rankings-300 mr-1" />
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
                      ? "You haven't liked any cards yet. Swipe right on cards in the Swipe section to see them here!" 
                      : "Session ID not found. Your swipes and votes may not be tracked correctly."}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                    <span className="font-semibold">Note:</span> Only cards you've swiped right on (liked) will appear in your personal rankings.
                  </p>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    <p>If you've recently voted but don't see your rankings:</p>
                    <ul className="list-disc list-inside mt-2 mx-auto max-w-md text-left">
                      <li>Try refreshing the rankings using the button below</li>
                      <li>Go to the Swipe page and swipe right on cards you like</li>
                      <li>Check that you're using the same browser session as when you swiped</li>
                      <li>Your session ID: <span className="font-mono">{sessionId ? sessionId.substring(0, 12) + '...' : 'Not found'}</span></li>
                      <li>Last check time: <span className="font-mono">{new Date().toISOString()}</span></li>
                    </ul>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <Link href="/swipe">
                      <Button variant="primary" className={moduleTheme.buttonClass}>
                        Go Swipe Some Cards 🔄
                      </Button>
                    </Link>
                    <Button 
                      variant="secondary" 
                      onClick={refreshData}
                      isLoading={refreshing}
                      className={`border-rankings-200 dark:border-rankings-800 hover:bg-rankings-50 dark:hover:bg-rankings-900/20`}
                    >
                      <FontAwesomeIcon icon={faRedo} className="mr-2 text-rankings-500" />
                      Refresh Rankings 🔄
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {refreshing && (
                    <div className="flex justify-center items-center py-2">
                      <LoadingSpinner size="sm" module="rankings" />
                      <span className={`ml-2 text-sm ${moduleTheme.textClass}`}>Refreshing your rankings... 🔄</span>
                    </div>
                  )}
                  
                  {personalRankings.map((card, index) => (
                    <motion.div
                      key={card._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className={`p-4 hover:bg-rankings-50/30 dark:hover:bg-rankings-900/10 border ${moduleTheme.borderClass} transition-colors duration-200`}>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          {/* Vote Status Indicator */}
                          <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-rankings-${card.voteStatus === 'liked' ? '500' : '300'} flex items-center justify-center`}>
                            <FontAwesomeIcon icon={getVoteStatusIndicator(card.voteStatus).icon} className="text-white" />
                          </div>
                          
                          {/* Card Content */}
                          <div className="flex-1">
                            <div className="flex flex-col">
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Card ID: {card._id}
                              </p>
                              <p className={`text-lg font-medium ${moduleTheme.textClass} mt-1`}>
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

