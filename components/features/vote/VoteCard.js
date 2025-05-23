import { motion, useAnimation } from "framer-motion";

export const VoteCard = ({ card, isSelected, onSelect, position = "left", disabled }) => {
  const controls = useAnimation();

  return (
    <motion.div
      whileHover={{ scale: isSelected || disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`
        relative w-full max-w-sm
        rounded-xl overflow-hidden
        bg-white dark:bg-gray-800
        border-2 transition-all duration-200
        ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
        ${isSelected 
          ? "border-primary-500 ring-4 ring-primary-500/30" 
          : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"}
      `}
      onClick={() => !disabled && onSelect()}
    >
      {/* Card Content */}
      <div className="aspect-[3/4] p-6 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xl text-center text-gray-900 dark:text-gray-100">
            {card.text}
          </p>
        </div>
        
        <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isSelected ? "✨ Selected" : `Press ${position === "left" ? "←" : "→"} to select`}
          </p>
        </div>
      </div>

      {/* Selection Badge */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute top-3 right-3 bg-primary-500 text-white p-2 rounded-full"
        >
          ✨
        </motion.div>
      )}

      {/* Position Indicator */}
      <motion.div
        className={`
          absolute bottom-3 ${position === "left" ? "left-3" : "right-3"}
          bg-gray-200 dark:bg-gray-700
          text-gray-800 dark:text-gray-200
          text-xs px-2 py-1 rounded-full
        `}
        whileHover={{ scale: 1.05 }}
      >
        {position === "left" ? "⬅️ Option A" : "Option B ➡️"}
      </motion.div>
    </motion.div>
  );
};
