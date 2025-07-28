import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Session } from '@/models/Session';
import { Card } from '@/models/Card';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    await connectDB();

    const { sessionId } = await params;

    const session = await Session.findOne({ sessionId }).lean();

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const cardIds = session.personalRanking;
    const cards = await Card.find({ uuid: { $in: cardIds } }).lean();
    const cardsById = cards.reduce((acc, card) => {
      acc[card.uuid] = card;
      return acc;
    }, {});

    const personalRanking = session.personalRanking.map((cardId, index) => ({
      rank: index + 1,
      card: cardsById[cardId],
    }));

    return NextResponse.json({
      personalRanking,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
