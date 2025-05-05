'use server';

import { connectToDatabase } from '@/lib/db';
import CardModel, { CardDocument, getCardModel } from '@/lib/models/Card';
import { revalidatePath } from 'next/cache';
import { CardStatus, Card } from '@/app/types/card'; // Ensure types are imported
import { Document } from 'mongoose';

// Helper type for MongoDB document with _id
type MongoDocument = Document & {
  _id: { toString(): string };
  [key: string]: any;
};

// Helper function to safely convert MongoDB document to Card type
function documentToCard(doc: MongoDocument): Card {
  return {
    id: doc._id.toString(),
    content: doc.content || '',
    status: doc.status || 'TODO',
    order: typeof doc.order === 'number' ? doc.order : 0,
    importance: Boolean(doc.importance),
    urgency: Boolean(doc.urgency),
    createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : 
               typeof doc.createdAt === 'string' ? doc.createdAt : 
               new Date().toISOString(),
    userName: doc.userName || undefined,
    userImage: doc.userImage || undefined
  };
}

// Simplified: Get all non-deleted cards (no user filtering)
export async function getCards(userId?: string): Promise<Card[]> { // userId param kept for compatibility, but ignored
  try {
    await connectToDatabase();
    const CardModel = await getCardModel();
    const cards = await CardModel.find({ isDeleted: { $ne: true } })
      .sort({ order: 1, createdAt: -1 }); // Sort by order, then by creation date

    // Use type assertion to ensure proper typing
    return cards.map(card => documentToCard(card as unknown as MongoDocument));
  } catch (error) {
    console.error("Error fetching cards:", error);
    throw new Error("Failed to fetch cards.");
  }
}

// Simplified: Get all deleted cards (no user filtering)
export async function getDeletedCards(userId?: string): Promise<Card[]> { // userId param kept for compatibility, but ignored
  try {
    await connectToDatabase();
    const CardModel = await getCardModel();
    const cards = await CardModel.find({ isDeleted: true })
      .sort({ deletedAt: -1 }); // Sort by deletion date

    // Use type assertion to ensure proper typing
    return cards.map(card => documentToCard(card as unknown as MongoDocument));
  } catch (error) {
    console.error("Error fetching deleted cards:", error);
    throw new Error("Failed to fetch deleted cards.");
  }
}

// Simplified: Update card status and order (no user check)
export async function updateCardStatus(
  cardId: string,
  newStatus: CardStatus,
  userId?: string, // Ignored
  newOrder?: number,
  importance?: boolean,
  urgency?: boolean
): Promise<Card> {
  try {
    await connectToDatabase();
    const CardModel = await getCardModel();
    const updateData: Partial<CardDocument> = { status: newStatus };
    if (newOrder !== undefined) {
      updateData.order = newOrder;
    }
    
    // Only update importance/urgency if explicitly provided
    if (importance !== undefined) {
      updateData.importance = importance;
    }
    if (urgency !== undefined) {
      updateData.urgency = urgency;
    }
    
    // If moving to Eisenhower quadrant, automatically update importance/urgency
    if (newStatus === 'Q1') {
      updateData.importance = true;
      updateData.urgency = true;
    } else if (newStatus === 'Q2') {
      updateData.importance = true;
      updateData.urgency = false;
    } else if (newStatus === 'Q3') {
      updateData.importance = false;
      updateData.urgency = true;
    } else if (newStatus === 'Q4') {
      updateData.importance = false;
      updateData.urgency = false;
    }

    const updatedCard = await CardModel.findByIdAndUpdate(
      cardId,
      updateData,
      { new: true, runValidators: true }
    );
    
    // Handle non-existent document
    if (!updatedCard) {
      throw new Error("Card not found");
    }

    revalidatePath('/');
    
    // Convert to proper Card type
    return documentToCard(updatedCard as unknown as MongoDocument);
  } catch (error) {
    console.error("Error updating card status:", error);
    throw new Error("Failed to update card status.");
  }
}

// Simplified: Create card (no user association)
export async function createCard(
  content: string, 
  userId?: string,
  importance: boolean = false,
  urgency: boolean = false
): Promise<Card> { // userId ignored
  if (!content || content.trim().length === 0) {
    throw new Error('Card content cannot be empty');
  }

  try {
    await connectToDatabase();
    const CardModel = await getCardModel();

    // Calculate the order for the new card (e.g., place it at the beginning)
    // Using negative timestamp ensures newest are first when sorted ascending by order
    const order = -Date.now();

    // Determine the initial status based on importance and urgency for Eisenhower Matrix
    let initialStatus: CardStatus = 'TODO';
    if (importance && urgency) {
      initialStatus = 'Q1'; // Urgent & Important
    } else if (importance && !urgency) {
      initialStatus = 'Q2'; // Important, Not Urgent
    } else if (!importance && urgency) {
      initialStatus = 'Q3'; // Urgent, Not Important
    } else if (!importance && !urgency) {
      initialStatus = 'Q4'; // Not Urgent, Not Important
    }

    // Create the new card
    const newCard = await CardModel.create({
      content: content.trim(),
      status: initialStatus,
      order: order,
      importance,
      urgency,
      // user field removed
    });

    // Type safety check for Mongoose document
    if (!newCard || !newCard._id) {
      throw new Error("Failed to create card properly");
    }

    revalidatePath('/');
    
    // Convert to proper Card type
    return documentToCard(newCard as unknown as MongoDocument);
  } catch (error) {
    console.error("Error creating card:", error);
    throw new Error("Failed to create card.");
  }
}

// Simplified: Soft delete card (no user check)
export async function softDeleteCard(cardId: string, userId?: string): Promise<{ success: boolean }> { // userId ignored
  try {
    await connectToDatabase();
    const CardModel = await getCardModel();
    const result = await CardModel.findByIdAndUpdate(cardId, {
      isDeleted: true,
      deletedAt: new Date(),
    });

    if (!result) {
      throw new Error("Card not found");
    }

    revalidatePath('/');
    revalidatePath('/?view=deleted'); // Revalidate deleted view
    return { success: true };
  } catch (error) {
    console.error("Error soft deleting card:", error);
    throw new Error("Failed to soft delete card.");
  }
}

// Removed getAllCards function
