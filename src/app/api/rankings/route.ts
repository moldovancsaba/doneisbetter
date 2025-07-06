import { NextRequest, NextResponse } from 'next/server';
import { getCardModel } from '@/models/Card';
import { getRankingModel } from '@/models/Ranking';
import connect from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    await connect();
    
    const Ranking = await getRankingModel();
    const rankings = await Ranking.find()
      .populate('cardId')
      .sort({ 'votes.total': -1 })
      .lean();

    // Map the rankings to include card details
    const mappedRankings = rankings.map(ranking => ({
      cardId: ranking.cardId._id,
      imageUrl: ranking.cardId.imageUrl || ranking.cardId.url,
      title: ranking.cardId.title || 'Card',
      votes: ranking.votes
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
