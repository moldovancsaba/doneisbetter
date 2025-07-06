import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VotingStatsProps {
  leftVotes: number;
  rightVotes: number;
  totalVotes: number;
  className?: string;
}

/**
 * VotingStats Component
 * 
 * Displays real-time voting statistics with animated updates.
 * Shows vote distribution and percentages.
 */
export const VotingStats: React.FC<VotingStatsProps> = ({
  leftVotes,
  rightVotes,
  totalVotes,
  className = '',
}) => {
  const [prevLeft, setPrevLeft] = useState(leftVotes);
  const [prevRight, setPrevRight] = useState(rightVotes);

  // Calculate percentages
  const leftPercentage = totalVotes === 0 ? 0 : (leftVotes / totalVotes) * 100;
  const rightPercentage = totalVotes === 0 ? 0 : (rightVotes / totalVotes) * 100;

  // Update previous values when current values change
  useEffect(() => {
    setPrevLeft(leftVotes);
    setPrevRight(rightVotes);
  }, [leftVotes, rightVotes]);

  // Determine if votes have increased
  const leftIncreased = leftVotes > prevLeft;
  const rightIncreased = rightVotes > prevRight;

  return (
    <div className={`p-4 bg-white rounded-lg shadow-md ${className}`}>
      <h3 className="text-lg font-semibold mb-4 text-center">Voting Statistics</h3>
      
      <div className="space-y-4">
        {/* Progress Bar */}
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${leftPercentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>

        {/* Vote Counts */}
        <div className="grid grid-cols-2 gap-4">
          {/* Left Votes */}
          <div className="text-center">
            <p className="text-sm text-gray-600">Left Votes</p>
            <AnimatePresence>
              <motion.p
                key={leftVotes}
                initial={{ y: leftIncreased ? 20 : -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-xl font-bold"
              >
                {leftVotes}
                <span className="text-sm ml-1">
                  ({leftPercentage.toFixed(1)}%)
                </span>
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Right Votes */}
          <div className="text-center">
            <p className="text-sm text-gray-600">Right Votes</p>
            <AnimatePresence>
              <motion.p
                key={rightVotes}
                initial={{ y: rightIncreased ? 20 : -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-xl font-bold"
              >
                {rightVotes}
                <span className="text-sm ml-1">
                  ({rightPercentage.toFixed(1)}%)
                </span>
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Total Votes */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">Total Votes</p>
          <AnimatePresence>
            <motion.p
              key={totalVotes}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-2xl font-bold text-gray-800"
            >
              {totalVotes}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
