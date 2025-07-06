import { NextRequest, NextResponse } from 'next/server';
import { getCardModel } from '@/models/Card';
import connect from '@/lib/mongodb';

/**
 * Updates a card's rank in the database
 * POST /api/cards/updateRank
 * 
 * Request body:
 * {
 *   id: string,     // Card ID
 *   rank: number    // New rank value
 * }
 */
export async function POST(request: NextRequest) {
  try {
    await connect();
    const { id, rank } = await request.json();

    // Validate request body
    if (!id || typeof rank !== 'number') {
      return NextResponse.json(
        { error: 'Both id and rank are required and rank must be a number' },
        { status: 400 }
      );
    }

    const Card = await getCardModel();

    // Update card rank
    const updatedCard = await Card.findByIdAndUpdate(
      id,
      { $set: { rank } },
      { new: true }
    );

    if (!updatedCard) {
      return NextResponse.json(
        { error: 'Card not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 'success',
      card: updatedCard
    });

  } catch (error) {
    console.error('Failed to update card rank:', error);
    return NextResponse.json(
      { error: 'Failed to update card rank' },
      { status: 500 }
    );
  }
}
