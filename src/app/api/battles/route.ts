import { NextRequest, NextResponse } from 'next/server';
import { getCardModel } from '@/models/Card';
import { getRankingModel } from '@/models/Ranking';
import connect from '@/lib/mongodb';
import { processComparisonOutcome } from '@/utils/cardRanking';

/**
 * Handles battle outcome submissions and updates rankings accordingly
 * POST /api/battles
 * 
 * Request body:
 * {
 *   winnerCardId: string,    // ID of the winning card
 *   loserCardId: string,     // ID of the losing card
 * }
 */
export async function POST(request: NextRequest) {
  try {
    await connect();
    const { winnerCardId, loserCardId } = await request.json();

    // Validate request body
    if (!winnerCardId || !loserCardId) {
      return NextResponse.json(
        { error: 'Both winnerCardId and loserCardId are required' },
        { status: 400 }
      );
    }

    if (winnerCardId === loserCardId) {
      return NextResponse.json(
        { error: 'Winner and loser cards must be different' },
        { status: 400 }
      );
    }

    const Card = await getCardModel();
    const Ranking = await getRankingModel();

    // Verify both cards exist
    const [winner, loser] = await Promise.all([
      Card.findById(winnerCardId),
      Card.findById(loserCardId)
    ]);

    if (!winner || !loser) {
      return NextResponse.json(
        { error: 'One or both cards not found' },
        { status: 404 }
      );
    }

    // Get current rankings
    const [winnerRanking, loserRanking] = await Promise.all([
      Ranking.findOne({ cardId: winnerCardId }),
      Ranking.findOne({ cardId: loserCardId })
    ]);

    // Calculate new ratings
    const outcome = {
      preferredCardId: winnerCardId,
      otherCardId: loserCardId
    };

    const cards = [
      { 
        id: winnerCardId,
        rating: winnerRanking?.rating || 1400
      },
      {
        id: loserCardId,
        rating: loserRanking?.rating || 1400
      }
    ];

    const newRatings = processComparisonOutcome(outcome, cards);

    // Update rankings in database
    const timestamp = new Date().toISOString();
    
    await Promise.all([
      // Update winner ranking
      Ranking.findOneAndUpdate(
        { cardId: winnerCardId },
        {
          $set: { rating: newRatings[winnerCardId] },
          $inc: { 'battles.won': 1, 'battles.total': 1 },
          $setOnInsert: { createdAt: timestamp }
        },
        { upsert: true, new: true }
      ),
      // Update loser ranking
      Ranking.findOneAndUpdate(
        { cardId: loserCardId },
        {
          $set: { rating: newRatings[loserCardId] },
          $inc: { 'battles.lost': 1, 'battles.total': 1 },
          $setOnInsert: { createdAt: timestamp }
        },
        { upsert: true, new: true }
      )
    ]);

    return NextResponse.json({
      status: 'success',
      ratings: newRatings,
      timestamp
    });

  } catch (error) {
    console.error('Failed to process battle outcome:', error);
    return NextResponse.json(
      { error: 'Failed to process battle outcome' },
      { status: 500 }
    );
  }
}
