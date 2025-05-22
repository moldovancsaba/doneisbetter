import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion";
import { useState } from "react";

export const SwipeCard = ({ content, onSwipe }) => {
  const [exitX, setExitX] = useState(0);
  const controls = useAnimation();
  
  // Motion values for interactive animations
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(
    x,
    [-200, -150, 0, 150, 200],
    [0, 1, 1, 1, 0]
  );

  // Visual feedback based on swipe direction
  const likeScale = useTransform(x, [0, 150], [1, 1.1]);
  const nopeScale = useTransform(x, [-150, 0], [1.1, 1]);

  const handleDragEnd = async (_, info) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (Math.abs(offset) > 100 || Math.abs(velocity) > 800) {
      const direction = offset > 0 ? "right" : "left";
      setExitX(offset > 0 ? 200 : -200);
      
      await controls.start({
        x: offset > 0 ? 1000 : -1000,
        transition: { duration: 0.2 }
      });
      
      onSwipe(direction);
    } else {
      controls.start({
        x: 0,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      });
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Like/Nope Indicators */}
      <motion.div
        className="absolute top-8 right-8 bg-green-500/90 text-white px-6 py-2 rounded-full font-semibold z-10"
        style={{ scale: likeScale, opacity: useTransform(x, [0, 100], [0, 1]) }}
      >
        LIKE
      </motion.div>
      <motion.div
        className="absolute top-8 left-8 bg-red-500/90 text-white px-6 py-2 rounded-full font-semibold z-10"
        style={{ scale: nopeScale, opacity: useTransform(x, [-100, 0], [1, 0]) }}
      >
        NOPE
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
              Swipe right to like, left to pass
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
