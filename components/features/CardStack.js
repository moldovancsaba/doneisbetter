import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export const CardStack = ({ cards, onSwipe }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(null);

  const handleSwipe = (direction) => {
    if (!cards || currentIndex >= cards.length) return;
    
    setSwipeDirection(direction);
    setTimeout(() => {
      onSwipe?.(direction);
      setCurrentIndex(prev => prev + 1);
      setSwipeDirection(null);
    }, 300);
  };

  // Add keyboard event listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!cards || currentIndex >= cards.length) return;
      
      if (e.key === "ArrowLeft") {
        handleSwipe("left");
      } else if (e.key === "ArrowRight") {
        handleSwipe("right");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [cards, currentIndex]);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <AnimatePresence>
        {cards && currentIndex < cards.length ? (
          <motion.div
            key={cards[currentIndex]._id}
            className="relative w-full"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={(_, { offset, velocity }) => {
              const swipe = offset.x;
              if (Math.abs(swipe) > 100 || Math.abs(velocity.x) > 800) {
                handleSwipe(swipe > 0 ? "right" : "left");
              }
            }}
          >
            <div className={`
              w-full aspect-[3/4] rounded-2xl overflow-hidden
              bg-white dark:bg-gray-800 shadow-xl
              border border-gray-200/50 dark:border-gray-700/50
              transition-all duration-200
            `}>
              <div className="h-full p-6 flex flex-col">
                <div className="flex-1 flex items-center justify-center text-center">
                  <p className="text-xl text-gray-900 dark:text-gray-100">
                    {cards[currentIndex].text}
                  </p>
                </div>
                
                <div className="text-center mt-4 text-sm text-gray-500 dark:text-gray-400">
                  Swipe right to like, left to pass
                </div>
                <div className="text-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Use ← / → arrows to control
                </div>
              </div>
            </div>

            {/* Swipe Indicators - Only show one bubble at a time */}
            {swipeDirection === "right" && (
              <motion.div
                className="absolute top-4 right-4 px-4 py-2 rounded-full bg-green-500/90 text-white font-semibold"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                LIKE
              </motion.div>
            )}
            {swipeDirection === "left" && (
              <motion.div
                className="absolute top-4 left-4 px-4 py-2 rounded-full bg-red-500/90 text-white font-semibold"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                NOPE
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              All Done! 🎉
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              You've gone through all the cards
            </p>
            <button
              onClick={() => setCurrentIndex(0)}
              className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Start Over
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Stack Effect */}
      {cards && currentIndex < cards.length - 1 && (
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{ transform: "scale(0.95) translateY(20px)" }}
        >
          <div className="w-full aspect-[3/4] rounded-2xl bg-white dark:bg-gray-800 opacity-50" />
        </div>
      )}
    </div>
  );
};
