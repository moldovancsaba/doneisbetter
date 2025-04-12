import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Card from '@/models/Card';
import { CardApiResponse } from '@/types';

/**
 * GET /api/cards - Retrieve all cards sorted by newest first
 */
export async function GET(): Promise<NextResponse<CardApiResponse>> {
  try {
    await connectDB();
    
    const cards = await Card.find({})
      .sort({ createdAt: -1 })
      .lean();
    
    return NextResponse.json({
      success: true,
      data: cards
    });
  } catch (error) {
    console.error('Error fetching cards:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch cards' 
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cards - Create a new card
 */
export async function POST(request: NextRequest): Promise<NextResponse<CardApiResponse>> {
  try {
    const body = await request.json();
    
    // Validate request body
    if (!body.content || typeof body.content !== 'string') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Content is required and must be a string' 
        }, 
        { status: 400 }
      );
    }
    
    // Trim content and check if it's empty
    const content = body.content.trim();
    if (!content) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Content cannot be empty' 
        }, 
        { status: 400 }
      );
    }
    
    // Connect to database
    await connectDB();
    
    // Create new card
    const card = await Card.create({ content });
    
    return NextResponse.json(
      { 
        success: true, 
        data: card 
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating card:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create card' 
      }, 
      { status: 500 }
    );
  }
}

