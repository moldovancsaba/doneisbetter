import { NextResponse } from 'next/server';
import { getCardModel } from '@/models/Card';
import { connectDB } from '@/lib/db';

export async function GET() {
  try {
    await connectDB();
    const Card = await getCardModel();
    
    const unswipedCount = await Card.countDocuments({
      $or: [
        { battlesWon: { $exists: false } },
        { battlesLost: { $exists: false } },
        { battlesWon: 0, battlesLost: 0 }
      ]
    });

    return NextResponse.json({
      hasUnswiped: unswipedCount > 0,
      count: unswipedCount
    });
  } catch (error) {
    console.error('Failed to check unswiped cards:', error);
    return NextResponse.json(
      { error: 'Failed to check unswiped cards' },
      { status: 500 }
    );
  }
}
