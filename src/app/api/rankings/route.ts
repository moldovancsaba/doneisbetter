import { NextRequest, NextResponse } from 'next/server';
import { getCardModel } from '@/models/Card';
import { getRankingModel } from '@/models/Ranking';
import connect from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    await connect();
    
    const Card = await getCardModel();
    
    // Get all cards with ranks
    const cards = await Card.find({ 
      rank: { $exists: true },
      imageUrl: {
        $exists: true,
        $ne: null,
        $not: { 
          $in: [
            /x1x1x1/,
            /x2x2x2/
          ]
        }
      }
    })
    .sort({ rank: -1 })
    .lean();

    // Map the cards to rankings format
    const mappedRankings = cards.map(card => ({
      cardId: card._id,
      imageUrl: card.imageUrl,
      title: card.title,
      rank: card.rank
    }));

    return NextResponse.json(mappedRankings);
  } catch (error) {
    console.error('Failed to fetch rankings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rankings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connect();
    const { cardId, vote } = await request.json();

    // Validate vote direction
    if (vote !== 'left' && vote !== 'right') {
      return NextResponse.json(
        { error: 'Invalid vote direction. Must be "left" or "right".' },
        { status: 400 }
      );
    }

    // Create or update ranking
    const Ranking = await getRankingModel();
    const ranking = await Ranking.findOneAndUpdate(
      { cardId },
      {
        $inc: {
          [`votes.${vote}`]: 1,
          'votes.total': 1
        },
        $setOnInsert: {
          createdAt: new Date().toISOString() // ISO 8601 UTC
        }
      },
      { 
        upsert: true, 
        new: true,
        setDefaultsOnInsert: true
      }
    );

    return NextResponse.json(ranking);
  } catch (error) {
    console.error('Failed to update ranking:', error);
    return NextResponse.json(
      { error: 'Failed to update ranking' },
      { status: 500 }
    );
  }
}
