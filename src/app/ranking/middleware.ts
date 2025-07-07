import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  try {
    // Check if there are unswiped cards
    const response = await fetch(new URL('/api/cards/hasUnswiped', request.url));
    if (!response.ok) {
      throw new Error('Failed to check unswiped cards');
    }
    
    const data = await response.json();
    
    // Redirect to /play if unswiped cards exist
    if (data.hasUnswiped) {
      return NextResponse.redirect(new URL('/play', request.url));
    }
    
    return NextResponse.next();
  } catch (error) {
    console.error('Error in ranking middleware:', error);
    // On error, allow access but the page will handle the error state
    return NextResponse.next();
  }
}

export const config = {
  matcher: '/ranking',
};
