import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Card } from '@/models/Card';
import { Session } from '@/models/Session';
import { CreateSessionSchema } from '@/lib/zod/schemas';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { success } = CreateSessionSchema.safeParse(body);

    if (!success) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const deckSize = parseInt(process.env.DECK_SIZE || '15', 10);

    const cards = await Card.aggregate([
      { $match: { isActive: true } },
      { $sample: { size: deckSize } }
    ]);

    if (cards.length < deckSize) {
      return NextResponse.json({ error: 'Not enough active cards to create a deck' }, { status: 500 });
    }

    const sessionId = uuidv4();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const session = new Session({
      sessionId,
      expiresAt,
      deck: cards.map(card => card.uuid),
    });

    await session.save();

    const sessionData = {
      sessionId,
      expiresAt,
      deck: cards,
    };

    const hash = await bcrypt.hash(JSON.stringify(sessionData), 10);

    return NextResponse.json({
      ...sessionData,
      hash,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
