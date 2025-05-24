import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useState, useEffect } from "react";
import { useModuleTheme } from "../../contexts/ModuleThemeContext";

export const CardStack = ({ cards, onSwipe }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const { theme: moduleTheme } = useModuleTheme();
  
  // Motion values for fluid animations
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-15, 0, 15]);
  const opacity = useTransform(x, [-300, -150, 0, 150, 300], [0.5, 0.9, 1, 0.9, 0.5]);
  
  // Reset motion values when currentIndex changes
  useEffect(() => {
    x.set(0);
    setSwipeDirection(null);
    setIsDragging(false);
    console.log("Reset animation state for new card");
  }, [currentIndex]);

  const handleSwipe = (direction) => {
    if (!cards || currentIndex >= cards.length) return;
    
    // Always set the swipe direction for visual feedback
    setSwipeDirection(direction);
    console.log("Swipe direction set:", direction);
    
    // Update x motion value for smooth animation
    const targetX = direction === "right" ? 500 : -500;
    x.set(targetX);
    console.log("X motion value set to:", targetX);
    
    // Create a two-step animation:
    // 1. First let the card animate out with the swipe direction
    // 2. Then update the index which will trigger a clean reset for the next card
    setTimeout(() => {
      // Notify parent component of swipe
      onSwipe?.(direction);
      
      // Move to next card - the useEffect will handle resetting the animation state
      setCurrentIndex(prev => prev + 1);
    }, 300);
  };

  // Add keyboard event listeners
  // Add visual feedback for keyboard swipes
  const handleKeyboardSwipe = (direction) => {
    // First ensure we're starting from a clean state
    x.set(0);
    setSwipeDirection(null);
    
    // Small delay to ensure the reset is applied
    setTimeout(() => {
      // Set direction for visual feedback
      setSwipeDirection(direction);
      
      // Move the card for better visual feedback
      x.set(direction === "right" ? 100 : -100);
      
      // Trigger the actual swipe after a short delay for feedback
      setTimeout(() => {
        handleSwipe(direction);
      }, 300);
    }, 50);
  };
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!cards || currentIndex >= cards.length) return;
      
      if (e.key === "ArrowLeft") {
        handleKeyboardSwipe("left");
      } else if (e.key === "ArrowRight") {
        handleKeyboardSwipe("right");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [cards, currentIndex]);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <AnimatePresence mode="wait" initial={false} onExitComplete={() => {
        // Ensure animation values are reset when exit animation completes
        x.set(0);
        console.log("Exit animation complete, reset x to 0");
      }}>
        {cards && currentIndex < cards.length ? (
          <motion.div
            key={cards[currentIndex]._id}
            className="relative w-full"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.8}
            style={{ 
              x, 
              rotate,
              opacity
            }}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={(_, { offset, velocity }) => {
              setIsDragging(false);
              const swipe = offset.x;
              if (Math.abs(swipe) > 100 || Math.abs(velocity.x) > 800) {
                handleSwipe(swipe > 0 ? "right" : "left");
              } else {
                // Reset if not swiped far enough
                // Use spring animation to reset instead of immediate set
                const controls = x.getAnimationControls();
                controls.start({
                  x: 0,
                  transition: { type: "spring", stiffness: 400, damping: 30 }
                });
              }
            }}
            whileDrag={{ scale: 1.02 }}
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ 
              opacity: 0, 
              scale: 0.95, 
              x: swipeDirection === "right" ? 500 : -500,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            transition={{ 
              type: "spring", 
              stiffness: 180, 
              damping: 20,
              mass: 0.8 // Lower mass for quicker transitions
            }}
          >
            <div className={`
              w-full aspect-[3/4] rounded-2xl overflow-hidden
              bg-white dark:bg-gray-800 shadow-xl
              border ${moduleTheme.borderClass}
              hover:shadow-2xl
              transition-all duration-200
            `}>
              <div className="h-full p-6 flex flex-col">
                <div className="flex-1 flex items-center justify-center text-center">
                  <p className={`text-xl ${moduleTheme.textClass} font-medium`}>
                    {cards[currentIndex].text}
                  </p>
                </div>
                
                <div className={`text-center mt-4 text-sm ${moduleTheme.textClass} text-opacity-70 dark:text-opacity-70`}>
                  Swipe right to like 👍, left to pass 👎
                </div>
                <div className={`text-center mt-2 text-sm ${moduleTheme.textClass} text-opacity-70 dark:text-opacity-70`}>
                  Use ← / → arrows to control
                </div>
              </div>
            </div>

            {/* Swipe Indicators - Dynamically show based on drag direction or swipe */}
            {/* Right swipe indicator */}
            <motion.div
              className={`absolute top-4 right-4 px-4 py-2 rounded-full ${moduleTheme.buttonClass} text-white font-semibold`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: swipeDirection === "right" || (isDragging && x.get() > 50) ? 1 : 0,
                scale: swipeDirection === "right" || (isDragging && x.get() > 50) ? 1 : 0.8
              }}
              transition={{ duration: 0.2 }}
            >
              👍 LIKE
            </motion.div>
            
            {/* Left swipe indicator */}
            <motion.div
              className="absolute top-4 left-4 px-4 py-2 rounded-full bg-red-500/90 text-white font-semibold"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: swipeDirection === "left" || (isDragging && x.get() < -50) ? 1 : 0,
                scale: swipeDirection === "left" || (isDragging && x.get() < -50) ? 1 : 0.8
              }}
              transition={{ duration: 0.2 }}
            >
              👎 NOPE
            </motion.div>
            
            {/* Debug display for swipe value - helps diagnose animation triggers */}
            <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-gray-500 opacity-60">
              {isDragging && (
                <div>
                  Swipe value: {Math.round(x.get())}
                  {x.get() < -50 && " (LEFT)"}
                  {x.get() > 50 && " (RIGHT)"}
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`text-center bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border ${moduleTheme.borderClass}`}
          >
            <h2 className={`text-2xl font-bold ${moduleTheme.textClass} mb-4`}>
              All Done! 🎉
            </h2>
            <p className={`${moduleTheme.textClass} text-opacity-70 dark:text-opacity-70 mb-6`}>
              You've gone through all the cards
            </p>
            <button
              onClick={() => setCurrentIndex(0)}
              className={`px-6 py-3 ${moduleTheme.buttonClass} text-white rounded-lg transition-colors`}
            >
              Start Over 🔄
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Stack Effect - Multiple stacked cards for a more realistic effect */}
      {cards && currentIndex < cards.length - 1 && (
        <>
          {/* First card behind */}
          <motion.div
            className="absolute top-0 left-0 right-0 pointer-events-none"
            style={{ 
              zIndex: -1,
              filter: "blur(1px)"
            }}
            animate={{
              scale: 0.97,
              y: 10,
              rotate: -1
            }}
          >
            <div className={`w-full aspect-[3/4] rounded-2xl bg-white dark:bg-gray-800 border ${moduleTheme.borderClass} opacity-70`} />
          </motion.div>
          
          {/* Second card behind (if available) */}
          {currentIndex < cards.length - 2 && (
            <motion.div
              className="absolute top-0 left-0 right-0 pointer-events-none"
              style={{ 
                zIndex: -2,
                filter: "blur(2px)"
              }}
              animate={{
                scale: 0.94,
                y: 20,
                rotate: -2
              }}
            >
              <div className={`w-full aspect-[3/4] rounded-2xl bg-white dark:bg-gray-800 border ${moduleTheme.borderClass} opacity-40`} />
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};
