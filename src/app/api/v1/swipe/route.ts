import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Session } from '@/models/Session';
import { SwipeRequestSchema } from '@/lib/zod/schemas';
import { verifySession } from '@/lib/session-manager';

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { sessionData, ...swipeData } = body;

    const isValidSession = await verifySession(sessionData);
    if (!isValidSession) {
        return NextResponse.json({ error: 'Invalid session' }, { status: 400 });
    }

    const { success, data } = SwipeRequestSchema.safeParse(swipeData);

    if (!success) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { sessionId, cardId, direction } = data;

    const session = await Session.findOne({ sessionId });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    session.swipes.push({ cardId, direction, timestamp: new Date() });

    let requiresVoting = false;
    let votingContext = null;

    if (direction === 'right') {
      const rightSwipes = session.swipes.filter(swipe => swipe.direction === 'right');
      if (rightSwipes.length >= 2) {
        requiresVoting = true;
        const lastRightSwipedCard = rightSwipes[rightSwipes.length - 2].cardId;
        votingContext = {
          newCard: cardId,
          compareAgainst: lastRightSwipedCard,
        };
      }
    }

    await session.save();

    return NextResponse.json({
      success: true,
      requiresVoting,
      votingContext,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
