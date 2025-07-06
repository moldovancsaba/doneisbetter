import { NextResponse } from 'next/server';
import { getCardModel } from '@/models/Card';
import { connectDB } from '@/lib/db';

export async function GET() {
  try {
    await connectDB();
    const Card = await getCardModel();
    
    // Get a random card that hasn't been fully ranked
    const cards = await Card.aggregate([
      { $match: { rank: { $exists: false } } },
      { $sample: { size: 1 } }
    ]);

    if (cards.length === 0) {
      return NextResponse.json({ message: 'No more cards available' }, { status: 404 });
    }

    const card = cards[0];
    
    return NextResponse.json({
      _id: card._id.toString(),
      title: card.title,
      description: card.description || '',
      imageUrl: card.imageUrl,
      rank: card.rank
    });
  } catch (error) {
    console.error('Failed to fetch next card:', error);
    return NextResponse.json(
      { error: 'Failed to fetch next card' },
      { status: 500 }
    );
  }
}
