import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion";
import { useState, useEffect } from "react";

export const SwipeCard = ({ content, onSwipe }) => {
  const [exitX, setExitX] = useState(0);
  const [showLeftBubble, setShowLeftBubble] = useState(false);
  const [showRightBubble, setShowRightBubble] = useState(false);
  const controls = useAnimation();
  
  // Motion values for interactive animations
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(
    x,
    [-200, -150, 0, 150, 200],
    [0, 1, 1, 1, 0]
  );

  const handleSwipeAnimation = async (direction) => {
    const targetX = direction === "right" ? 200 : -200;
    setExitX(targetX);

    // Show appropriate bubble
    if (direction === "left") {
      setShowLeftBubble(true);
      setShowRightBubble(false);
    } else {
      setShowLeftBubble(false);
      setShowRightBubble(true);
    }

    // Animate card
    await controls.start({
      x: direction === "right" ? 1000 : -1000,
      rotate: direction === "right" ? 45 : -45,
      transition: { duration: 0.3 }
    });

    // Hide bubbles after animation
    setTimeout(() => {
      setShowLeftBubble(false);
      setShowRightBubble(false);
    }, 300);

    onSwipe(direction);
  };

  const handleDragEnd = async (_, info) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (Math.abs(offset) > 100 || Math.abs(velocity) > 800) {
      const direction = offset > 0 ? "right" : "left";
      await handleSwipeAnimation(direction);
    } else {
      controls.start({
        x: 0,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      });
    }
  };

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = async (event) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        const direction = event.key === "ArrowRight" ? "right" : "left";
        await handleSwipeAnimation(direction);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Like/Nope Indicators */}
      <motion.div
        className="absolute top-8 right-8 bg-green-500/90 text-white px-6 py-2 rounded-full font-semibold z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: showRightBubble ? 1 : 0,
          scale: showRightBubble ? 1.1 : 0.8
        }}
      >
        👍 LIKE
      </motion.div>
      <motion.div
        className="absolute top-8 left-8 bg-red-500/90 text-white px-6 py-2 rounded-full font-semibold z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: showLeftBubble ? 1 : 0,
          scale: showLeftBubble ? 1.1 : 0.8
        }}
      >
        👎 NOPE
      </motion.div>

      {/* Card */}
      <motion.div
        animate={controls}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.9}
        onDragEnd={handleDragEnd}
        style={{ x, rotate, opacity }}
        className="
          bg-white dark:bg-gray-800
          rounded-2xl shadow-xl
          overflow-hidden
          cursor-grab active:cursor-grabbing
          touch-none
        "
      >
        <div className="aspect-[4/5] p-6 flex flex-col">
          <div className="flex-1 flex items-center justify-center text-center">
            <p className="text-xl text-gray-900 dark:text-gray-100">
              {content.text}
            </p>
          </div>
          
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Swipe or use ← → arrow keys
            </p>
          </div>
        </div>

        {/* Glass Effect Bottom */}
        <div className="
          absolute bottom-0 left-0 right-0
          h-24 bg-gradient-to-t
          from-white dark:from-gray-800
          to-transparent
        " />
      </motion.div>
    </div>
  );
};
