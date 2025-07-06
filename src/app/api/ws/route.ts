import { WebSocketHandler } from '@/lib/websocket';

// WebSocket setup suitable for Next.js running in an Edge-compatible environment
import { Server } from 'ws';

export async function GET(request: Request) {
  if (request.headers.get('upgrade') !== 'websocket') {
    return new Response('Expected Upgrade: websocket', { status: 426 });
  }

  try {
    const server = new Server({ noServer: true });
    const clientConnection = new Promise((resolve, reject) => {
      server.handleUpgrade(request, request.socket, Buffer.alloc(0), (ws) => {
        resolve(ws);
      });
    });

    const socket = await clientConnection;

    socket.on('message', (message) => {
      console.log('Received message:', message);
      socket.send('Response to ' + message);
    });

    socket.on('close', () => {
      console.log('WebSocket closed');
    });

    return new Response(null, { status: 101 });

  } catch (error) {
    console.error('WebSocket setup error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
