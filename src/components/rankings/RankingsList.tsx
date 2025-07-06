'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RankingData } from '@/hooks/useRankings';
import { useWebSocket } from '@/hooks/useWebSocket';
import { SortControls } from './SortControls';
import { RankingsFilter } from './RankingsFilter';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

interface RankingsListProps {
  rankings: RankingData[];
  isPersonal: boolean;
}

type SortField = 'rank' | 'weight' | 'timestamp';

interface SortConfig {
  field: SortField;
  direction: 'asc' | 'desc';
}

interface FilterConfig {
  timeRange: '24h' | '7d' | '30d' | 'all';
}

export const RankingsList: React.FC<RankingsListProps> = ({ rankings: initialRankings, isPersonal }) => {
  const { lastMessage, error: wsError } = useWebSocket();
  const [rankings, setRankings] = useState<RankingData[]>(initialRankings);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<SortConfig>({ field: 'rank', direction: 'asc' });
  const [filter, setFilter] = useState<FilterConfig>({ timeRange: 'all' });

  // Handle incoming WebSocket messages for ranking updates
  useEffect(() => {
    if (!lastMessage) return;

    if (lastMessage.type === 'rankingUpdate') {
      setRankings(prevRankings => {
        const updatedRankings = [...prevRankings];
        const updatedData = lastMessage.data;

        // Update rankings that changed
        updatedData.forEach((update: RankingData) => {
          const index = updatedRankings.findIndex(r => r.ranking._id === update.ranking._id);
          if (index !== -1) {
            updatedRankings[index] = update;
          } else {
            updatedRankings.push(update);
          }
        });

        // Apply current sort and filter
        return applyFiltersAndSort(updatedRankings, sort, filter);
      });
    }
  }, [lastMessage, sort, filter]);

  // Apply sorting and filtering
  const applyFiltersAndSort = (data: RankingData[], sortConfig: SortConfig, filterConfig: FilterConfig) => {
    let filtered = [...data];

    // Apply time range filter
    if (filterConfig.timeRange !== 'all') {
      const now = new Date();
      const timeRangeMap = {
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000,
      };
      const timeLimit = now.getTime() - timeRangeMap[filterConfig.timeRange];
      filtered = filtered.filter(item => new Date(item.ranking.timestamp).getTime() > timeLimit);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortConfig.field) {
        case 'weight':
          comparison = a.ranking.weight - b.ranking.weight;
          break;
        case 'timestamp':
          comparison = new Date(a.ranking.timestamp).getTime() - new Date(b.ranking.timestamp).getTime();
          break;
        default:
          comparison = a.ranking.rank - b.ranking.rank;
      }
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });

    return filtered;
  };

  // Handle sort change
  const handleSortChange = (newSort: SortConfig) => {
    setSort(newSort);
    setRankings(prev => applyFiltersAndSort(prev, newSort, filter));
  };

  // Handle filter change
  const handleFilterChange = (newFilter: FilterConfig) => {
    setFilter(newFilter);
    setRankings(prev => applyFiltersAndSort(prev, sort, newFilter));
  };

  if (error || wsError) {
    return <ErrorMessage message={error || 'WebSocket connection error'} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <SortControls
          currentSort={sort}
          onSortChange={handleSortChange}
        />
        <RankingsFilter
          options={filter}
          onChange={handleFilterChange}
        />
      </div>

      <motion.div layout className="space-y-4">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <AnimatePresence>
            {rankings.map((item, index) => (
              <motion.div
                key={item.ranking._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white p-6 rounded-lg shadow relative overflow-hidden flex flex-col items-center justify-center gap-4"
              >
                <div className="flex items-center justify-center w-full gap-6">
                  <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                  <div className="flex flex-col items-center flex-grow space-y-3">
                    <h3 className="text-lg font-semibold">{item.card.title}</h3>
                    <p className="text-gray-600">{item.card.description}</p>
                    <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                      <span>Weight: {item.ranking.weight.toFixed(2)}</span>
                      <span>Rank: #{item.ranking.rank}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">
                      Last Updated:
                      <br />
                      {new Date(item.ranking.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {rankings.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 bg-white rounded-lg shadow"
              >
                <p className="text-xl font-semibold text-gray-600">No Rankings Found</p>
                <p className="mt-2 text-gray-500">
                  {filter.timeRange !== 'all'
                    ? 'Try adjusting your time filter'
                    : 'Vote on some cards to see them appear here!'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  );
};
