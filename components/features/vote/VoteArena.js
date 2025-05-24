import { motion } from "framer-motion";
import { VoteCard } from "./VoteCard";
import { useState, useEffect } from "react";

export const VoteArena = ({ card1, card2, onVote, loading }) => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [animatingOut, setAnimatingOut] = useState(false);

  const handleCardSelect = (cardId) => {
    if (animatingOut || loading) return;
    setSelectedCard(cardId);
  };

  const handleVoteSubmit = (cardId) => {
    if (animatingOut || loading) return;
    setAnimatingOut(true);
    
    // Animate out, then call onVote
    setTimeout(() => {
      const winnerId = cardId;
      const loserId = winnerId === card1._id ? card2._id : card1._id;
      
      onVote(winnerId, loserId);
      setSelectedCard(null);
      setAnimatingOut(false);
    }, 500);
  };

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (loading || animatingOut) return;

      if (event.key === "ArrowLeft") {
        if (selectedCard === card1._id) {
          // If already selected, submit the vote
          handleVoteSubmit(card1._id);
        } else {
          // Otherwise, select the card
          handleCardSelect(card1._id);
        }
      } else if (event.key === "ArrowRight") {
        if (selectedCard === card2._id) {
          // If already selected, submit the vote
          handleVoteSubmit(card2._id);
        } else {
          // Otherwise, select the card
          handleCardSelect(card2._id);
        }
      } else if (event.key === "Enter" && selectedCard) {
        // Submit vote on Enter if a card is selected
        handleVoteSubmit(selectedCard);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCard, loading, animatingOut, card1._id, card2._id]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Card 1 */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
          className="flex justify-center"
        >
          <VoteCard
            card={card1}
            isSelected={selectedCard === card1._id}
            onSelect={() => handleCardSelect(card1._id)}
            position="left"
            disabled={loading}
          />
        </motion.div>

        {/* Card 2 */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3 }}
          className="flex justify-center"
        >
          <VoteCard
            card={card2}
            isSelected={selectedCard === card2._id}
            onSelect={() => handleCardSelect(card2._id)}
            position="right"
            disabled={loading}
          />
        </motion.div>
      </div>

      {/* VS Indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex justify-center -mt-4 mb-4"
      >
        <div className="bg-gray-200 dark:bg-gray-700 rounded-full w-12 h-12 flex items-center justify-center text-2xl text-gray-700 dark:text-gray-300">
          🆚
        </div>
      </motion.div>

      {/* Vote Button */}
      {selectedCard && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mt-6"
        >
          <button
            onClick={() => handleVoteSubmit(selectedCard)}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200 font-medium flex items-center gap-2"
            disabled={animatingOut || loading}
          >
            {loading ? "⏳ Loading..." : animatingOut ? "✨ Recording Vote..." : "✅ Confirm Vote"}
            <span className="text-sm opacity-75">(or press Enter)</span>
          </button>
        </motion.div>
      )}

      {/* Keyboard Controls Help */}
      <div className="text-center mt-4 text-sm text-gray-500 dark:text-gray-400">
        Use ⬅️ and ➡️ arrow keys to select, Enter to confirm
      </div>
    </div>
  );
};
