/**
 * WebSocket handler class for managing real-time connections and message broadcasting
 * for card rankings and voting progress updates.
 */
export class WebSocketHandler {
  private clients: Set<WebSocket>;
  private heartbeatInterval: number;

  constructor(heartbeatInterval: number = 30000) {
    this.clients = new Set();
    this.heartbeatInterval = heartbeatInterval;
  }

  /**
   * Add a new client connection
   */
  public addClient(socket: WebSocket): void {
    this.clients.add(socket);
    this.setupHeartbeat(socket);
  }

  /**
   * Remove a client connection
   */
  public removeClient(socket: WebSocket): void {
    this.clients.delete(socket);
  }

  /**
   * Setup heartbeat to keep connection alive
   */
  private setupHeartbeat(socket: WebSocket): void {
    const interval = setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'ping' }));
      } else {
        clearInterval(interval);
      }
    }, this.heartbeatInterval);

    socket.addEventListener('close', () => clearInterval(interval));
  }

  /**
   * Handle incoming messages from clients
   */
  public handleMessage(socket: WebSocket, data: any): void {
    switch (data.type) {
      case 'vote':
        // Broadcast vote update to all clients
        this.broadcastVoteUpdate(data.cardId, data.voteData);
        break;
      case 'ranking':
        // Broadcast ranking update to all clients
        this.broadcastRankingUpdate(data.rankings);
        break;
      case 'pong':
        // Handle heartbeat response
        break;
      default:
        console.warn('Unknown message type:', data.type);
    }
  }

  /**
   * Broadcast vote updates to all connected clients
   */
  private broadcastVoteUpdate(cardId: string, voteData: any): void {
    const message = JSON.stringify({
      type: 'voteUpdate',
      cardId,
      data: voteData,
      timestamp: new Date().toISOString()
    });

    this.broadcast(message);
  }

  /**
   * Broadcast ranking updates to all connected clients
   */
  private broadcastRankingUpdate(rankings: any): void {
    const message = JSON.stringify({
      type: 'rankingUpdate',
      data: rankings,
      timestamp: new Date().toISOString()
    });

    this.broadcast(message);
  }

  /**
   * Broadcast a message to all connected clients
   */
  private broadcast(message: string): void {
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.send(message);
        } catch (error) {
          console.error('Error sending message to client:', error);
          this.removeClient(client);
        }
      }
    });
  }

  /**
   * Get the current number of connected clients
   */
  public getClientCount(): number {
    return this.clients.size;
  }
}
