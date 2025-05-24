import Image from "next/image";
import { motion } from "framer-motion";

export const VoteCard = ({ card, isSelected, onSelect, position, disabled }) => {
  return (
    <motion.div
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={() => !disabled && onSelect()}
      className={`relative cursor-pointer transition-all duration-200 ${
        isSelected ? "ring-4 ring-primary-500" : ""
      }`}
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

        {/* Selection Indicator */}
        {isSelected && (
          <div
            className={`absolute top-4 ${
              position === "left" ? "left-4" : "right-4"
            } bg-primary-500 text-white px-4 py-2 rounded-full`}
          >
            ✨ Selected
          </div>
        )}
      </div>
    </motion.div>
  );
};
