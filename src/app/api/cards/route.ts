import { NextRequest, NextResponse } from 'next/server';
import { getCardModel } from '@/models/Card';
import { getRankingModel } from '@/models/Ranking';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';

export async function GET() {
  try {
    console.log('Starting GET operation...');
    await connectDB();
    const Card = await getCardModel();
    
    const cards = await Card.find({
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
    }).lean();
    console.log('Found cards:', cards);
    
    // Map cards to consistent format
    const mappedCards = (cards as Array<{ _id: mongoose.Types.ObjectId; title?: string; imageUrl?: string; url?: string; createdAt?: string; }>).map(card => ({
      id: card._id.toString(),
      title: card.title || `Card ${(card.createdAt ? new Date(card.createdAt).toLocaleString() : 'Unknown Date')}`,
      imageUrl: card.imageUrl || card.url
    }));
    
    console.log('Mapped cards:', mappedCards);
    return NextResponse.json(mappedCards);
  } catch (error) {
    console.error('Failed to fetch cards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cards' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cards
 * Creates a new card
 * Expects { title?: string, imageUrl: string } in request body
 */
export async function POST(request: NextRequest) {
  try {
    console.log('Starting POST operation...');
    await connectDB();
    console.log('Connected to MongoDB');

    // Parse request body
    const body = await request.json();
    console.log('Request body:', body);

    // Validate required fields
    if (!body.imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    // Validate image URL format and ensure it points to a real image
    if (!body.imageUrl.startsWith('https://i.ibb.co/') || 
        body.imageUrl.includes('x1x1x1') || 
        body.imageUrl.includes('x2x2x2')) {
      return NextResponse.json(
        { error: 'Invalid image URL. Only real imgbb.com URLs are allowed' },
        { status: 400 }
      );
    }

    // Try to fetch the image to verify it exists
    try {
      const imageResponse = await fetch(body.imageUrl, { method: 'HEAD' });
      if (!imageResponse.ok) {
        return NextResponse.json(
          { error: 'Image URL is not accessible' },
          { status: 400 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to validate image URL' },
        { status: 400 }
      );
    }

    const Card = await getCardModel();
    
    // Create card data with timestamps
    const cardData = {
      title: body.title || `Card ${new Date().toLocaleString()}`,
      imageUrl: body.imageUrl,
      createdAt: new Date().toISOString(),
    };

    // Create new card
    const card = await Card.create(cardData);
    console.log('Created card:', card);

    // Map response to consistent format
    const mappedCard = {
      id: card._id.toString(),
      title: card.title,
      imageUrl: card.imageUrl
    };

    return NextResponse.json(mappedCard, { status: 201 });
  } catch (error) {
    console.error('Failed to create card:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create card';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cards?id={cardId}
 * Deletes a card and its associated rankings from the database
 * Uses transaction to ensure atomic operations
 */
export async function DELETE(request: NextRequest) {
  try {
    console.log('Starting DELETE operation...');
    await connectDB();
    console.log('Connected to MongoDB');
    
    // Try to get cardId from URL params first, then from request body
    const { searchParams } = new URL(request.url);
    let cardId = searchParams.get('id');
    
    // If not in URL params, try request body
    if (!cardId) {
      try {
        const body = await request.json();
        cardId = body.cardId;
      } catch (e) {
        // Ignore JSON parse error
      }
    }
    
    console.log('CardId from request:', cardId);

    // Validate cardId
    if (!cardId || !mongoose.Types.ObjectId.isValid(cardId)) {
      return NextResponse.json(
        { error: 'Valid Card ID is required' },
        { status: 400 }
      );
    }

    // Start a transaction
    const session = await mongoose.startSession();
    
    try {
      await session.withTransaction(async () => {
        const [Card, Ranking] = await Promise.all([
          getCardModel(),
          getRankingModel()
        ]);

        const card = await Card.findById(cardId).session(session);
        if (!card) {
          throw new Error('Card not found');
        }

        // Delete associated rankings first
        const deleteRankingsResult = await Ranking.deleteMany({ cardId }).session(session);
        console.log('Deleted rankings:', deleteRankingsResult);
        
        // Delete the card
        const deleteCardResult = await Card.findByIdAndDelete(cardId).session(session);
        console.log('Deleted card:', deleteCardResult);

        if (!deleteCardResult) {
          throw new Error('Failed to delete card');
        }
      });

      return NextResponse.json({ 
        message: 'Card and associated rankings deleted successfully',
        deletedCardId: cardId
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Card not found') {
        return NextResponse.json(
          { error: 'Card not found' },
          { status: 404 }
        );
      }
      throw error;
    } finally {
      await session.endSession();
    }
  } catch (error) {
    console.error('Failed to delete card:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete card';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
