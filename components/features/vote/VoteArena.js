import { motion } from "framer-motion";
import { VoteCard } from "./VoteCard";
import { useState } from "react";

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
            onVote={() => handleVoteSubmit(card1._id)}
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
            onVote={() => handleVoteSubmit(card2._id)}
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
        <div className="bg-gray-200 dark:bg-gray-700 rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg text-gray-700 dark:text-gray-300">
          VS
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
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200 font-medium"
            disabled={animatingOut || loading}
          >
            {loading ? "Loading..." : animatingOut ? "Recording Vote..." : "Confirm Vote"}
          </button>
        </motion.div>
      )}
    </div>
  );
  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-2 gap-4 w-full mb-8">
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className={`col-span-1 ${selectedCard === card1._id ? 'ring-4 ring-primary-500 ring-offset-2' : ''}`}
        >
          <VoteCard
            content={card1}
            position="left"
            selected={selectedCard === card1._id}
            onSelect={() => handleCardSelect(card1._id)}
          />
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className={`col-span-1 ${selectedCard === card2._id ? 'ring-4 ring-primary-500 ring-offset-2' : ''}`}
        >
          <VoteCard
            content={card2}
            position="right"
            selected={selectedCard === card2._id}
            onSelect={() => handleCardSelect(card2._id)}
          />
        </motion.div>
      </div>
      
      <VoteControls
        onVote={handleVoteSubmit}
        disabled={!selectedCard || loading}
        loading={loading}
      />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-sm text-center text-gray-500"
      >
        Select the option you prefer, then click Vote
      </motion.div>
    </div>
  );
};

