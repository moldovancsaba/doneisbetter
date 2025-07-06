import { WebSocketHandler } from '@/lib/websocket';

// Edge Runtime configuration
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (request.headers.get('upgrade') !== 'websocket') {
    return new Response('Expected Upgrade: websocket', { status: 426 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    // Validate token if needed
    if (!token) {
      return new Response('Unauthorized', { status: 401 });
    }
    
    const { 0: client, 1: server } = new WebSocketPair();

    server.accept();
    server.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);
        server.send(JSON.stringify({ received: true, data }));
      } catch (error) {
        console.error('Error handling message:', error);
        server.send(JSON.stringify({ error: 'Invalid message format' }));
      }
    });

    server.addEventListener('close', () => {
      console.log('WebSocket closed');
    });

    return new Response(null, {
      status: 101,
      webSocket: client
    });

  } catch (error) {
    console.error('WebSocket setup error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
