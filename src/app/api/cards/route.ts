import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/middleware/validateRequest';
import { withDatabase } from '@/lib/db';
import { getCardModel, CardDocument } from '@/lib/models/Card';
import { DatabaseError, DatabaseErrorType } from '@/lib/errors/DatabaseError';
import type { SortOrder, Document } from 'mongoose';
import { APIError, withErrorHandler, withMethodHandler } from '@/lib/middleware/errorHandler';
import { z } from 'zod';
import { 
  cardSchema, 
  createCardSchema, 
  updateCardSchema, 
  deleteCardSchema 
} from '@/lib/validations/card';
import { revalidatePath } from 'next/cache';

// Schema for GET request query parameters
const getCardsQuerySchema = z.object({
  status: z.string().optional(),
  deleted: z.preprocess(
    // Convert 'true'/'false' strings to boolean
    val => val === 'true' ? true : val === 'false' ? false : val,
    z.boolean().optional()
  ),
  importance: z.preprocess(
    val => val === 'true' ? true : val === 'false' ? false : val,
    z.boolean().optional()
  ),
  urgency: z.preprocess(
    val => val === 'true' ? true : val === 'false' ? false : val,
    z.boolean().optional()
  ),
  limit: z.coerce.number().positive().default(50),
  page: z.coerce.number().positive().default(1),
  sort: z.string().optional(),
});

/**
 * Handler to fetch cards with optional filtering
 */
const handleGetCards = validateRequest(getCardsQuerySchema, async (req, data) => {
  return await withDatabase(async () => {
    const CardModel = await getCardModel();
    
    // Build query based on filters
    const filter: Record<string, any> = {};
    
    if (data.status) {
      filter.status = data.status;
    }
    
    if (data.deleted !== undefined) {
      filter.isDeleted = data.deleted;
    } else {
      // By default, exclude deleted cards
      filter.isDeleted = { $ne: true };
    }
    
    if (data.importance !== undefined) {
      filter.importance = data.importance;
    }
    
    if (data.urgency !== undefined) {
      filter.urgency = data.urgency;
    }
    
    // Pagination options with explicit type assertions
    const limit = Number(data.limit);
    const page = Number(data.page);
    const skip = (page - 1) * limit;
    
    // Sorting options
    let sort: Record<string, SortOrder> = { order: 1, createdAt: -1 };
    if (data.sort) {
      // Format: "field:direction" (e.g., "createdAt:desc")
      const [field, direction] = data.sort.split(':');
      sort = { [field]: direction === 'desc' ? -1 : 1 };
    }
    
    // Execute query with pagination
    const cards = await CardModel.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
    
    // Get total count for pagination
    const totalCount = await CardModel.countDocuments(filter);
    
    // Convert to clean card objects
    const formattedCards = cards.map(card => ({
      id: card._id.toString(),
      content: card.content,
      status: card.status,
      order: card.order,
      importance: card.importance,
      urgency: card.urgency,
      createdAt: card.createdAt instanceof Date ? card.createdAt.toISOString() : card.createdAt,
      updatedAt: card.updatedAt instanceof Date ? card.updatedAt.toISOString() : card.updatedAt,
      isDeleted: card.isDeleted || false,
      deletedAt: card.deletedAt instanceof Date ? card.deletedAt.toISOString() : card.deletedAt
    }));
    
    return NextResponse.json({
      success: true,
      data: formattedCards,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit)
      }
    });
  });
});

/**
 * Handler to create a new card
 */
const handleCreateCard = validateRequest(createCardSchema, async (req, data) => {
  return await withDatabase(async () => {
    const CardModel = await getCardModel();
    
    // Determine initial status based on importance and urgency
    let initialStatus = 'TODO';
    if (data.importance && data.urgency) {
      initialStatus = 'Q1'; // Urgent & Important
    } else if (data.importance && !data.urgency) {
      initialStatus = 'Q2'; // Important, Not Urgent
    } else if (!data.importance && data.urgency) {
      initialStatus = 'Q3'; // Urgent, Not Important
    } else if (data.importance === false && data.urgency === false) {
      initialStatus = 'Q4'; // Not Urgent, Not Important
    }
    
    // Calculate order for new card (newest at top)
    const order = -Date.now();
    
    // Create new card
    const newCard = await CardModel.create({
      content: data.content.trim(),
      status: initialStatus,
      order,
      importance: data.importance ?? false,
      urgency: data.urgency ?? false
    });
    
    // Revalidate routes that display cards
    revalidatePath('/');
    
    // Type assertion to ensure proper type safety
    const typedCard = newCard as unknown as CardDocument & Document;
    
    // Return created card
    return NextResponse.json({
      success: true,
      message: 'Card created successfully',
      data: {
        id: typedCard._id.toString(),
        content: typedCard.content,
        status: typedCard.status,
        order: typedCard.order,
        importance: typedCard.importance,
        urgency: typedCard.urgency,
        createdAt: typedCard.createdAt instanceof Date ? typedCard.createdAt.toISOString() : new Date().toISOString(),
        updatedAt: typedCard.updatedAt instanceof Date ? typedCard.updatedAt.toISOString() : new Date().toISOString()
      }
    }, { status: 201 });
  });
});

/**
 * Handler to update an existing card
 */
const handleUpdateCard = validateRequest(updateCardSchema, async (req, data) => {
  return await withDatabase(async () => {
    const CardModel = await getCardModel();
    const { cardId, ...updateData } = data;
    
    // Check if card exists
    const cardExists = await CardModel.exists({ _id: cardId });
    if (!cardExists) {
      throw APIError.notFound('Card', cardId);
    }
    
    // If moving to Eisenhower quadrant, automatically update importance/urgency
    if (updateData.status === 'Q1') {
      updateData.importance = true;
      updateData.urgency = true;
    } else if (updateData.status === 'Q2') {
      updateData.importance = true;
      updateData.urgency = false;
    } else if (updateData.status === 'Q3') {
      updateData.importance = false;
      updateData.urgency = true;
    } else if (updateData.status === 'Q4') {
      updateData.importance = false;
      updateData.urgency = false;
    }
    
    // Update card
    const updatedCard = await CardModel.findByIdAndUpdate(
      cardId,
      updateData,
      { new: true, runValidators: true }
    );
    
    // If card wasn't found (shouldn't happen due to check above)
    if (!updatedCard) {
      throw APIError.notFound('Card', cardId);
    }
    
    // Revalidate routes that display cards
    revalidatePath('/');
    
    // Type assertion to ensure proper type safety
    const typedCard = updatedCard as unknown as CardDocument & Document;
    
    // Return updated card
    return NextResponse.json({
      success: true,
      message: 'Card updated successfully',
      data: {
        id: typedCard._id.toString(),
        content: typedCard.content,
        status: typedCard.status,
        order: typedCard.order,
        importance: typedCard.importance,
        urgency: typedCard.urgency,
        createdAt: typedCard.createdAt instanceof Date ? typedCard.createdAt.toISOString() : new Date().toISOString(),
        updatedAt: typedCard.updatedAt instanceof Date ? typedCard.updatedAt.toISOString() : new Date().toISOString()
      }
    });
  });
});

/**
 * Handler to soft-delete a card
 */
const handleDeleteCard = validateRequest(deleteCardSchema, async (req, data) => {
  return await withDatabase(async () => {
    const CardModel = await getCardModel();
    const { cardId } = data;
    
    // Check if card exists
    const cardExists = await CardModel.exists({ _id: cardId });
    if (!cardExists) {
      throw APIError.notFound('Card', cardId);
    }
    
    // Soft delete by setting isDeleted flag and deletedAt timestamp
    const result = await CardModel.findByIdAndUpdate(
      cardId,
      {
        isDeleted: true,
        deletedAt: new Date()
      },
      { new: true }
    );
    
    // Revalidate routes that display cards
    revalidatePath('/');
    revalidatePath('/?view=deleted');
    
    // Type assertion to ensure proper type safety
    const typedResult = result as unknown as CardDocument & Document;
    
    return NextResponse.json({
      success: true,
      message: 'Card deleted successfully',
      data: {
        id: typedResult._id.toString(),
        deletedAt: typedResult.deletedAt instanceof Date ? typedResult.deletedAt.toISOString() : new Date().toISOString()
      }
    });
  });
});

/**
 * Export method handlers with error handling
 */
export const GET = withErrorHandler(handleGetCards);
export const POST = withErrorHandler(handleCreateCard);
export const PATCH = withErrorHandler(handleUpdateCard);
export const PUT = withErrorHandler(handleUpdateCard); // Alias PUT to PATCH for flexibility
export const DELETE = withErrorHandler(handleDeleteCard);

// Note: For Next.js App Router, we can't use a default export for route handlers
// Instead, we can implement method-not-allowed handling in each method's handler if needed

