import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface WebSocketMessage {
  type: string;
  data?: any;
  cardId?: string;
  timestamp?: string;
}

/**
 * Custom hook for managing Socket.IO connection and real-time updates
 */
export const useWebSocket = () => {
  const socket = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Initialize Socket.IO connection with auto-reconnect
   */
  const connect = useCallback(() => {
    if (socket.current?.connected) return;

    const socketUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    socket.current = io(socketUrl, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    // Connection event handlers
    socket.current.on('connect', () => {
      console.log('Socket.IO connected');
      setIsConnected(true);
      setError(null);
    });

    socket.current.on('disconnect', (reason) => {
      console.log('Socket.IO disconnected:', reason);
      setIsConnected(false);
    });

    socket.current.on('connect_error', (err) => {
      console.error('Socket.IO connection error:', err);
      setError(err);
    });

    // Message event handlers
    socket.current.on('voteUpdate', (message) => {
      setLastMessage({
        type: 'voteUpdate',
        ...message,
        timestamp: new Date().toISOString(),
      });
    });

    socket.current.on('rankingUpdate', (message) => {
      setLastMessage({
        type: 'rankingUpdate',
        ...message,
        timestamp: new Date().toISOString(),
      });
    });

    return () => {
      socket.current?.disconnect();
    };
  }, []);

  /**
   * Send a message through the Socket.IO connection
   */
  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (socket.current?.connected) {
      socket.current.emit(message.type, message);
    } else {
      console.warn('Socket.IO is not connected');
    }
  }, []);

  /**
   * Notify a vote update
   */
  const notifyVote = useCallback((cardId: string, voteData: any) => {
    sendMessage({
      type: 'voteUpdate',
      cardId,
      data: voteData,
      timestamp: new Date().toISOString(),
    });
  }, [sendMessage]);

  /**
   * Notify a ranking update
   */
  const notifyRankingUpdate = useCallback((rankings: any) => {
    sendMessage({
      type: 'rankingUpdate',
      data: rankings,
      timestamp: new Date().toISOString(),
    });
  }, [sendMessage]);

  // Connect on mount, cleanup on unmount
  useEffect(() => {
    connect();
    return () => {
      socket.current?.disconnect();
    };
  }, [connect]);

  return {
    isConnected,
    lastMessage,
    error,
    notifyVote,
    notifyRankingUpdate,
    sendMessage,
  };
};
