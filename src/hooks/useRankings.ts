import { useState, useEffect, useCallback } from 'react';

// Types
export interface Ranking {
  _id: string;
  cardId: string;
  sessionId: string;
  rank: number;
  weight: number;
  timestamp: string; // ISO 8601 UTC with ms
}

export interface RankingData {
  card: {
    title: string;
    description: string;
  };
  ranking: Ranking;
}

export interface FilterOptions {
  timeRange: '24h' | '7d' | '30d' | 'all';
  category: string;
  difficulty: string;
}

export interface SortOption {
  field: 'rank' | 'timestamp' | 'weight';
  direction: 'asc' | 'desc';
}

interface RankingsResponse {
  rankings: RankingData[];
  total: number;
}

// WebSocket hook for real-time updates
export const useRankingsWebSocket = (onUpdate: (data: RankingData) => void) => {
  useEffect(() => {
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001');
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onUpdate(data);
      } catch (error) {
        console.error('WebSocket message parsing error:', error);
      }
    };

    return () => {
      ws.close();
    };
  }, [onUpdate]);
};

// Polling fallback hook
export const usePollingFallback = (enabled: boolean, callback: () => void) => {
  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(callback, 30000); // 30 seconds polling interval

    return () => clearInterval(interval);
  }, [enabled, callback]);
};

// Main rankings hook with caching and real-time updates
export const useRankings = (
  filters: FilterOptions,
  sort: SortOption,
  page: number
) => {
  const [data, setData] = useState<RankingsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [wsConnected, setWsConnected] = useState(true);

  const fetchRankings = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        timeRange: filters.timeRange,
        category: filters.category,
        difficulty: filters.difficulty,
        sortBy: sort.field,
        sortDir: sort.direction,
        page: String(page),
        limit: '20',
      });

      const response = await fetch(`/api/rankings?${params}`);
      if (!response.ok) throw new Error('Failed to fetch rankings');
      
      const newData = await response.json();
      setData(newData);
      
      // Cache the results
      sessionStorage.setItem('rankings-cache', JSON.stringify({
        data: newData,
        timestamp: new Date().toISOString(),
        filters,
        sort,
        page,
      }));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setWsConnected(false); // Enable polling fallback
    } finally {
      setLoading(false);
    }
  }, [filters, sort, page]);

  // Initialize from cache if available
  useEffect(() => {
    const cached = sessionStorage.getItem('rankings-cache');
    if (cached) {
      const { data: cachedData, timestamp, filters: cachedFilters, sort: cachedSort, page: cachedPage } = JSON.parse(cached);
      const cacheAge = Date.now() - new Date(timestamp).getTime();
      
      if (
        cacheAge < 5 * 60 * 1000 && // 5 minutes cache TTL
        JSON.stringify(filters) === JSON.stringify(cachedFilters) &&
        JSON.stringify(sort) === JSON.stringify(cachedSort) &&
        page === cachedPage
      ) {
        setData(cachedData);
        setLoading(false);
      } else {
        fetchRankings();
      }
    } else {
      fetchRankings();
    }
  }, [fetchRankings, filters, sort, page]);

  // WebSocket integration
  useRankingsWebSocket((update) => {
    setData((prev) => {
      if (!prev) return prev;
      
      // Optimistically update the rankings
      const updateRankings = (rankings: RankingData[]) =>
        rankings.map((item) =>
          item.ranking._id === update.ranking._id ? update : item
        );

      return {
        ...prev,
        rankings: updateRankings(prev.rankings),
      };
    });
  });

  // Polling fallback
  usePollingFallback(!wsConnected, fetchRankings);

  return { data, loading, error, refetch: fetchRankings };
};
