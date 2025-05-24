import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

export const SwipeCard = ({
  card,
  onSwipe,
  active,
  disabled,
  showControls = true,
}) => {
  const controls = useAnimation();
  const [direction, setDirection] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnd = (event, info) => {
    const swipeThreshold = 100;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    if (Math.abs(offset) > swipeThreshold || Math.abs(velocity) > 500) {
      const direction = offset > 0 ? "right" : "left";
      const swipeAnimation = {
        x: direction === "right" ? 1000 : -1000,
        opacity: 0,
        transition: { duration: 0.5 },
      };

      controls.start(swipeAnimation).then(() => {
        onSwipe(direction);
      });
    } else {
      controls.start({ x: 0, opacity: 1 });
    }
    setDirection(null);
    setIsDragging(false);
  };

  // Handle keyboard controls
  useEffect(() => {
    if (!active || disabled) return;

    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        setDirection("left");
        const swipeAnimation = {
          x: -1000,
          opacity: 0,
          transition: { duration: 0.5 },
        };
        controls.start(swipeAnimation).then(() => {
          onSwipe("left");
        });
      } else if (event.key === "ArrowRight") {
        setDirection("right");
        const swipeAnimation = {
          x: 1000,
          opacity: 0,
          transition: { duration: 0.5 },
        };
        controls.start(swipeAnimation).then(() => {
          onSwipe("right");
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [active, disabled, controls, onSwipe]);

  return (
    <motion.div
      className={`relative ${active ? "cursor-grab active:cursor-grabbing" : ""}`}
      drag={active && !disabled ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragStart={() => setIsDragging(true)}
      onDrag={(event, info) => {
        const offset = info.offset.x;
        setDirection(offset > 0 ? "right" : "left");
      }}
      onDragEnd={handleDragEnd}
      animate={controls}
      initial={{ scale: 1 }}
      whileDrag={{ scale: 1.05 }}
    >
      <div className="relative w-72 h-96 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700">
        <Image
          src={card.imageUrl}
          alt={card.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <h3 className="text-white text-xl font-semibold">{card.name}</h3>
        </div>

        {/* Swipe Direction Indicators */}
        {isDragging && direction === "left" && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full">
            👎 Nope
          </div>
        )}
        {isDragging && direction === "right" && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full">
            👍 Like
          </div>
        )}
      </div>

      {/* Swipe Controls */}
      {active && showControls && !disabled && (
        <div className="absolute -bottom-16 left-0 right-0 flex justify-center items-center gap-8">
          <button
            onClick={() => {
              setDirection("left");
              controls
                .start({
                  x: -1000,
                  opacity: 0,
                  transition: { duration: 0.5 },
                })
                .then(() => {
                  onSwipe("left");
                });
            }}
            className="bg-red-500 hover:bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200"
          >
            👎
          </button>
          <button
            onClick={() => {
              setDirection("right");
              controls
                .start({
                  x: 1000,
                  opacity: 0,
                  transition: { duration: 0.5 },
                })
                .then(() => {
                  onSwipe("right");
                });
            }}
            className="bg-green-500 hover:bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200"
          >
            👍
          </button>
        </div>
      )}

      {/* Keyboard Controls Help */}
      {active && showControls && !disabled && (
        <div className="absolute -bottom-28 left-0 right-0 text-center text-sm text-gray-500 dark:text-gray-400">
          Use ⬅️ and ➡️ arrow keys to swipe
        </div>
      )}
    </motion.div>
  );
};
