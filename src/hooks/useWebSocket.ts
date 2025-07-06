import { useEffect, useRef, useCallback, useState } from 'react';

interface WebSocketMessage {
  type: string;
  data?: any;
  cardId?: string;
  timestamp?: string;
}

export const useWebSocket = () => {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout>();
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  /**
   * Initialize WebSocket connection
   */
  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) return;

    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000'}/api/ws`;
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      reconnectAttempts.current = 0;
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      
      // Attempt reconnection if not at max attempts
      if (reconnectAttempts.current < maxReconnectAttempts) {
        reconnectTimeout.current = setTimeout(() => {
          reconnectAttempts.current += 1;
          connect();
        }, 1000 * Math.pow(2, reconnectAttempts.current)); // Exponential backoff
      }
    };

    ws.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        // Handle ping messages for connection keepalive
        if (message.type === 'ping') {
          ws.current?.send(JSON.stringify({ type: 'pong' }));
          return;
        }
        
        setLastMessage(message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }, []);

  /**
   * Send a message through the WebSocket connection
   */
  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }, []);

  /**
   * Notify a vote update
   */
  const notifyVote = useCallback((cardId: string, voteData: any) => {
    sendMessage({
      type: 'vote',
      cardId,
      data: voteData,
      timestamp: new Date().toISOString()
    });
  }, [sendMessage]);

  /**
   * Notify a ranking update
   */
  const notifyRankingUpdate = useCallback((rankings: any) => {
    sendMessage({
      type: 'ranking',
      data: rankings,
      timestamp: new Date().toISOString()
    });
  }, [sendMessage]);

  // Connect on mount, cleanup on unmount
  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [connect]);

  return {
    isConnected,
    lastMessage,
    notifyVote,
    notifyRankingUpdate,
    sendMessage
  };
};
