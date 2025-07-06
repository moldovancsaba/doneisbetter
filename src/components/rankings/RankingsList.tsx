'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RankingData } from '@/hooks/useRankings';
import { useWebSocket } from '@/hooks/useWebSocket';

interface RankingsListProps {
  rankings: RankingData[];
  isPersonal: boolean;
}

export const RankingsList: React.FC<RankingsListProps> = ({ rankings, isPersonal }) => {
  const { lastMessage } = useWebSocket();

  // Handle incoming WebSocket messages for ranking updates
  useEffect(() => {
    if (!lastMessage) return;

    if (lastMessage.type === 'rankingUpdate') {
      // Update rankings here if needed
      console.log('Ranking update received:', lastMessage);
    }
  }, [lastMessage]);

  return (
  <motion.div layout className="space-y-4">
    <AnimatePresence>
      {rankings.map((item, index) => (
        <motion.div
          key={item.ranking._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white p-4 rounded-lg shadow"
        >
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
            <div className="flex-grow">
              <h3 className="text-lg font-semibold">{item.card.title}</h3>
              <p className="text-gray-600">{item.card.description}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">
                Score: {item.ranking.weight.toFixed(2)}
              </div>
              <div className="text-xs text-gray-400">
                {new Date(item.ranking.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  </motion.div>
  );
};
