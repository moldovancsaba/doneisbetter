import React, { useCallback, useState, useEffect } from 'react';
import { PageWrapper } from "../components/layout/PageWrapper";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { LoadingScreen, LoadingSpinner } from "../components/ui/Loading";
import { useToast } from "../components/ui/Toast";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useModuleTheme } from "../contexts/ModuleThemeContext";
import { toISOWithMillisec } from "../utils/dates";
import {
  faTrophy,
  faArrowUp,
  faChartBar,
  faRedo,
  faEdit,
  faTrash,
  faSave,
  faTimes
} from "@fortawesome/free-solid-svg-icons";

export default function AdminPage() {
  const [cards, setCards] = useState([]);
  const [cardStats, setCardStats] = useState({});
  const [loadingCards, setLoadingCards] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [newCardText, setNewCardText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [editText, setEditText] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const { addToast } = useToast();
  const { theme: moduleTheme } = useModuleTheme();

  // Function to fetch cards via HTTP
  const fetchCards = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) {
      setRefreshing(true);
    } else {
      setLoadingCards(true);
    }
    
    try {
      const response = await fetch('/api/cards');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCards(data.data);
        } else {
          addToast("Failed to fetch cards", "error");
        }
      } else {
        addToast("Failed to fetch cards", "error");
      }
    } catch (error) {
      console.error('Error fetching cards:', error);
      addToast("Error fetching cards", "error");
    } finally {
      setLoadingCards(false);
      setRefreshing(false);
    }
  }, [addToast]);
  // Function to fetch card statistics
  const fetchCardStats = useCallback(async (showRefreshing = false) => {
    if (!showRefreshing) {
      setLoadingStats(true);
    }
    
    try {
      const response = await fetch('/api/vote/rankings');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Convert array to object with card ID as key for easy lookup
          const statsMap = {};
          data.data.forEach(item => {
            statsMap[item._id] = {
              rank: item.rank,
              wins: item.wins,
              totalVotes: item.totalVotes,
              winRate: item.winRate,
              lastUpdated: item.lastUpdated,
              createdAt: item.createdAt
            };
          });
          setCardStats(statsMap);
        } else {
          addToast("Failed to fetch card statistics", "error");
        }
      } else {
        addToast("Failed to fetch card statistics", "error");
      }
    } catch (error) {
      console.error('Error fetching card stats:', error);
      addToast("Error fetching card statistics", "error");
    } finally {
      setLoadingStats(false);
    }
  }, [addToast]);
  
  // Handle refresh
  const refreshAllData = useCallback(() => {
    fetchCards(true);
    fetchCardStats(true);
  }, [fetchCards, fetchCardStats]);

  // Initial data fetch
  useEffect(() => {
    fetchCards();
    fetchCardStats();
  }, [fetchCards, fetchCardStats]);

  // Format date to ISO string with milliseconds
  const formatISODate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return toISOWithMillisec(new Date(dateString));
    } catch (error) {
      console.error('Invalid date:', error);
      return "Invalid date";
    }
  };

  // Handle form submission
  const handleCreateCard = useCallback(async (e) => {
    e.preventDefault();
    if (!newCardText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newCardText.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Add the new card to the list
          setCards(prev => [...prev, data.data]);
          setNewCardText("");
          addToast("Card created successfully", "success");
          // Refresh stats
          fetchCardStats();
        } else {
          addToast(data.error || "Failed to create card", "error");
        }
      } else {
        addToast("Failed to create card", "error");
      }
    } catch (error) {
      console.error('Error creating card:', error);
      addToast("Failed to create card", "error");
    } finally {
      setIsSubmitting(false);
    }
  }, [newCardText, isSubmitting, fetchCardStats, addToast]);
  
  // Start editing a card
  const startEditCard = useCallback((card) => {
    setEditingCard(card._id);
    setEditText(card.text);
  }, []);

  // Cancel editing
  const cancelEdit = useCallback(() => {
    setEditingCard(null);
    setEditText("");
  }, []);
  
  // Save edited card
  const saveEditedCard = useCallback(async (cardId) => {
    if (!editText.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/cards/${cardId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: editText.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Update the card in the list
          setCards(prev => prev.map(card => 
            card._id === cardId ? { ...card, text: editText.trim() } : card
          ));
          setEditingCard(null);
          setEditText("");
          addToast("Card updated successfully", "success");
          
          // Refresh stats
          fetchCardStats();
        } else {
          addToast(data.error || "Failed to update card", "error");
        }
      } else {
        addToast("Failed to update card", "error");
      }
    } catch (error) {
      console.error('Error updating card:', error);
      addToast("Failed to update card", "error");
    } finally {
      setIsSubmitting(false);
    }
  }, [editText, isSubmitting, fetchCardStats, addToast]);

  // Handle card deletion
  const handleDeleteCard = useCallback(async (cardId) => {
    try {
      const response = await fetch(`/api/cards/${cardId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Remove the card from the list
        setCards(prev => prev.filter(card => card._id !== cardId));
        addToast("Card deleted successfully", "success");
        
        // Refresh stats
        fetchCardStats();
      } else {
        addToast("Failed to delete card", "error");
      }
    } catch (error) {
      console.error('Error deleting card:', error);
      addToast("Failed to delete card", "error");
    }
  }, [fetchCardStats, addToast]);

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
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-admin-500 to-admin-700">Card Management ⚙️</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Create and manage your decision cards
            </p>
          </div>

          <Button
            onClick={refreshAllData}
            variant="primary"
            isLoading={refreshing}
            disabled={refreshing}
            className={`flex items-center ${moduleTheme.buttonClass}`}
          >
            <FontAwesomeIcon icon={faRedo} className="mr-2" />
            Refresh Data 🔄
          </Button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {[
            { 
              label: "Total Cards 📊", 
              value: loadingCards ? "..." : cards.length, 
              icon: faChartBar,
              color: "text-admin-500 dark:text-admin-400"
            },
            { 
              label: "Total Votes 🗳️", 
              value: loadingStats ? "..." : Object.values(cardStats).reduce((sum, stat) => sum + (stat.totalVotes || 0), 0),
              icon: faArrowUp,
              color: "text-admin-600 dark:text-admin-300"
            },
            { 
              label: "Top Win Rate 🏆", 
              value: loadingStats ? "..." : 
                (Object.values(cardStats).length > 0 ? 
                  `${Math.max(...Object.values(cardStats).map(s => s.winRate || 0))}%` : 
                  "N/A"),
              icon: faTrophy,
              color: "text-admin-700 dark:text-admin-200"
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Card Form */}
          <Card className={`p-6 lg:col-span-1 border ${moduleTheme.borderClass}`}>
            <h2 className={`text-xl font-semibold mb-4 ${moduleTheme.textClass}`}>Create New Card 📝</h2>
            <form onSubmit={handleCreateCard} className="space-y-4">
              <div>
                <textarea
                  value={newCardText}
                  onChange={(e) => setNewCardText(e.target.value)}
                  placeholder="Enter card text..."
                  className={`w-full px-4 py-3 rounded-lg resize-none
                           bg-white dark:bg-gray-800
                           border ${moduleTheme.borderClass}
                           focus:ring-2 focus:ring-admin-500/50 focus:border-admin-500`}
                  rows="4"
                  maxLength="160"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {newCardText.length}/160 characters
                </p>
              </div>
              <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={!newCardText.trim() || isSubmitting}
                className={`w-full ${moduleTheme.buttonClass}`}
              >
                Create Card 📝
              </Button>
            </form>
          </Card>

          {/* Cards List */}
          <div className="lg:col-span-2">
            <Card className={`p-6 border ${moduleTheme.borderClass}`}>
              <h2 className={`text-xl font-semibold mb-4 ${moduleTheme.textClass}`}>Existing Cards 📋</h2>
              <div className="space-y-4">
                <AnimatePresence>
                  {cards.map((card) => (
                    <motion.div
                      key={card._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="group relative"
                    >
                      <Card className={`p-4 hover:bg-admin-50/30 dark:hover:bg-admin-900/10 border ${moduleTheme.borderClass}`}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1 pr-4">
                            <p className="text-sm mb-1">
                              Card ID: {card._id}
                            </p>
                            
                            {editingCard === card._id ? (
                              /* Edit Mode */
                              <div className="mt-2 mb-4">
                                <textarea
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                  className="w-full px-3 py-2 rounded-lg resize-none
                                          bg-white dark:bg-gray-800
                                          border border-gray-200 dark:border-gray-700
                                          focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
                                  rows="3"
                                  maxLength="160"
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {editText.length}/160 characters
                                </p>
                              </div>
                            ) : (
                              <p className={`text-md font-medium mb-2 ${moduleTheme.textClass}`}>
                                {card.text}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex space-x-2 ml-4">
                            {editingCard === card._id ? (
                              <>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => {
                                    setEditingCard(null);
                                    setEditText("");
                                  }}
                                  className={`border-admin-200 dark:border-admin-800 hover:bg-admin-50 dark:hover:bg-admin-900/20`}
                                >
                                  <FontAwesomeIcon icon={faTimes} className={`mr-1 text-admin-500 dark:text-admin-400`} />
                                  Cancel
                                </Button>
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => saveEditedCard(card._id)}
                                  isLoading={isSubmitting}
                                  disabled={isSubmitting || !editText.trim()}
                                  className={moduleTheme.buttonClass}
                                >
                                  <FontAwesomeIcon icon={faSave} className="mr-1" />
                                  Save
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => startEditCard(card)}
                                  className={moduleTheme.buttonClass}
                                >
                                  <FontAwesomeIcon icon={faEdit} className="mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => handleDeleteCard(card._id)}
                                  className={`border-admin-200 dark:border-admin-800 hover:bg-admin-50 dark:hover:bg-admin-900/20`}
                                >
                                  <FontAwesomeIcon icon={faTrash} className={`mr-1 text-admin-500 dark:text-admin-400`} />
                                  Delete
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                        
                        {/* Card Stats - Only show in view mode */}
                        {editingCard !== card._id && (
                          <div className={`grid grid-cols-3 gap-4 mt-4 p-4 ${moduleTheme.lightBg} ${moduleTheme.darkBg} rounded-lg border ${moduleTheme.borderClass}`}>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Wins</p>
                              <p className="text-base font-semibold">
                                {cardStats[card._id] ? cardStats[card._id].wins : 0}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Total Votes</p>
                              <p className="text-base font-semibold">
                                {cardStats[card._id] ? cardStats[card._id].totalVotes : 0}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Win Rate</p>
                              <p className="text-base font-semibold">
                                {cardStats[card._id] ? cardStats[card._id].winRate : 0}%
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Timestamps */}
                        <div className="mt-4 text-xs text-gray-500">
                          <p>Last updated: {formatISODate(card.updatedAt)}</p>
                          <p className="mt-1">Created: {formatISODate(card.createdAt)}</p>
                        </div>
                      </Card>
                    </motion.div>
                    ))}
                  </AnimatePresence>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
