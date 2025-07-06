// WebSocket route handler for Edge Runtime
import { headers } from 'next/headers';

export const runtime = 'edge';

export async function GET(request: Request) {
  const headersList = headers();
  const upgradeHeader = headersList.get('upgrade');

  if (upgradeHeader !== 'websocket') {
    return new Response('Expected Upgrade: websocket', { status: 426 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Create WebSocket upgrade response
    const responseHeaders = new Headers({
      'Upgrade': 'websocket',
      'Connection': 'Upgrade',
      'Sec-WebSocket-Accept': await generateAcceptValue(headersList.get('sec-websocket-key') || ''),
    });

    return new Response(null, {
      status: 101,
      headers: responseHeaders,
    });

  } catch (error) {
    console.error('WebSocket setup error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

// Helper function to generate WebSocket accept value using Web Crypto API
async function generateAcceptValue(secWebSocketKey: string): Promise<string> {
  const GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
  const input = secWebSocketKey + GUID;
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashBase64 = btoa(String.fromCharCode(...hashArray));
  
  return hashBase64;
}
