import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { ratelimit } from './lib/rate-limiter';

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/api/')) {
    const ip = req.ip ?? '127.0.0.1';
    const { success } = await ratelimit.limit(ip);
    if (!success) {
      return new NextResponse('Too many requests', { status: 429 });
    }
  }

  if (req.nextUrl.pathname.startsWith('/api/v1/admin')) {
    const token = await getToken({ req, secret: process.env.JWT_SECRET });
    if (!token) {
      return new NextResponse('Authentication error', { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
