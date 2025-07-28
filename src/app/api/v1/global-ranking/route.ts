import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { GlobalRanking } from '@/models/GlobalRanking';
import { Card } from '@/models/Card';
import { ICard } from '@/interfaces/Card';

export async function GET() {
  try {
    await connectDB();

    const rankings = await GlobalRanking.find({})
      .sort({ totalScore: -1 })
      .limit(100)
      .lean();

    const cardIds = rankings.map(r => r.cardId);
    const cards = await Card.find({ uuid: { $in: cardIds } }).lean() as unknown as ICard[];
    const cardsById: { [key: string]: ICard } = cards.reduce((acc, card) => {
      acc[card.uuid] = card;
      return acc;
    }, {} as { [key: string]: ICard });

    const populatedRankings = rankings.map(r => ({
      ...r,
      card: cardsById[r.cardId],
    }));

    return NextResponse.json({
      ranking: populatedRankings,
      lastUpdated: new Date().toISOString(),
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
