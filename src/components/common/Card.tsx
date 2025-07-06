import { type Card as CardType } from '@/types/card';
import { motion } from 'framer-motion';

interface CardProps {
  card: CardType;
  rank?: number;
  onClick?: () => void;
  className?: string;
}

export function Card({ card, rank, onClick, className = '' }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card-base bg-gray-900 rounded-lg overflow-hidden ${className}`}
      onClick={onClick}
    >
      <div className="card-image-container w-full h-48 overflow-hidden">
        <img
          src={card.imageUrl}
          alt={card.title}
          className="card-image w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      {rank !== undefined && (
        <div className="card-content p-4 text-center">
          <div className="card-rank text-2xl font-bold text-yellow-400 mb-2">
            🏆 #{rank + 1}
          </div>
          <div className="text-white text-sm">
            Rank: {card.rank || 1400}
          </div>
        </div>
      )}
    </motion.div>
  );
}
