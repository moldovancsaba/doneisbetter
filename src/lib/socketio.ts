import { Server as HTTPServer } from 'http';
import { Server as IOServer, Socket } from 'socket.io';
import { Server as SocketServer } from 'socket.io';

/**
 * Socket.IO handler class for managing real-time connections and message broadcasting
 * for card rankings and voting progress updates.
 */
export class SocketIOHandler {
  private io: SocketServer;
  private connectedClients: Map<string, Socket>;

  constructor(server: HTTPServer) {
    this.io = new IOServer(server, {
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
      },
      pingTimeout: 60000,
      pingInterval: 25000,
    });
    this.connectedClients = new Map();

    this.setupEventHandlers();
  }

  /**
   * Initialize Socket.IO event handlers
   */
  private setupEventHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
      this.handleConnection(socket);

      socket.on('disconnect', () => this.handleDisconnect(socket));
      socket.on('voteUpdate', (data) => this.handleVoteUpdate(data));
      socket.on('rankingUpdate', (data) => this.handleRankingUpdate(data));
      socket.on('error', (error) => this.handleError(error));
    });
  }

  /**
   * Handle new client connections
   */
  private handleConnection(socket: Socket): void {
    console.log(`Client connected: ${socket.id}`);
    this.connectedClients.set(socket.id, socket);

    // Send initial connection status
    socket.emit('connectionStatus', { connected: true });
  }

  /**
   * Handle client disconnections
   */
  private handleDisconnect(socket: Socket): void {
    console.log(`Client disconnected: ${socket.id}`);
    this.connectedClients.delete(socket.id);
  }

  /**
   * Handle vote update events
   */
  private handleVoteUpdate(data: any): void {
    this.io.emit('voteUpdate', {
      type: 'voteUpdate',
      ...data,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Handle ranking update events
   */
  private handleRankingUpdate(data: any): void {
    this.io.emit('rankingUpdate', {
      type: 'rankingUpdate',
      ...data,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Handle error events
   */
  private handleError(error: any): void {
    console.error('Socket.IO error:', error);
  }

  /**
   * Get the current number of connected clients
   */
  public getClientCount(): number {
    return this.connectedClients.size;
  }
}

export default SocketIOHandler;
