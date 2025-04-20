'use server';

import { connectDB } from '@/lib/db';
import mongoose, { Schema, Model } from 'mongoose';
import { revalidatePath } from 'next/cache';
import { Card } from './page';

// Define response types
type ActionResponse = {
  success: boolean;
  error?: string;
  message?: string;
  updatedStatus?: string;
};

// Card document interface for mongoose
interface ICard {
  content: string;
  status: 'active' | 'done' | 'deleted' | 'decide';
  order: number;
  createdAt: Date;
}

// Define the Mongoose schema
const cardSchema = new Schema<ICard>({
  content: {
    type: String,
    required: [true, 'Card content cannot be empty.'],
    trim: true,
    maxlength: [500, 'Content cannot exceed 500 characters.']
  },
  status: {
    type: String,
    enum: ['active', 'done', 'deleted', 'decide'],
    default: 'active'
  },
  order: {
    type: Number,
    required: true,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Optional: Add index for sorting performance
cardSchema.index({ status: 1, order: 1 });

// Initialize the model - only once if it doesn't exist
let CardModel: Model<ICard>;

try {
  CardModel = mongoose.model<ICard>('Card');
} catch {
  CardModel = mongoose.model<ICard>('Card', cardSchema);
}

// Create a new card
export async function createCard(data: { content: string }): Promise<ActionResponse> {
  if (!data || typeof data.content !== 'string' || !data.content.trim()) {
    return { success: false, error: 'Invalid input: Content is required.' };
  }

  try {
    await connectDB();
    // Use negative timestamp for default order (newest first visually if sorted ascending)
    const defaultOrder = -Date.now();
    await CardModel.create({
      content: data.content.trim(),
      order: defaultOrder
    });
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error creating card:', error);
    
    if (error instanceof mongoose.Error.ValidationError) {
      return { success: false, error: error.message };
    }
    
    return { success: false, error: 'Failed to save card due to a server error.' };
  }
}

// Get all cards
export async function getCards(): Promise<Card[]> {
  try {
    await connectDB();
    const cards = await CardModel.find({})
      .sort({ order: 1 })
      .lean();

    return cards.map(card => ({
      id: card._id.toString(),
      content: card.content,
      status: card.status,
      order: card.order,
      createdAt: card.createdAt.toISOString()
    }));
  } catch (error) {
    console.error('Error fetching cards:', error);
    return [];
  }
}

// Update card status
export async function updateCardStatus(
  cardId: string, 
  newStatus: 'active' | 'done' | 'deleted' | 'decide'
): Promise<ActionResponse> {
  if (!cardId || !['active', 'done', 'deleted', 'decide'].includes(newStatus)) {
    return { success: false, error: 'Invalid status provided.' };
  }
  
  try {
    await connectDB();
    const updatedCard = await CardModel.findByIdAndUpdate(
      cardId, 
      { status: newStatus }, 
      { new: true }
    );
    
    if (!updatedCard) {
      return { success: false, error: 'Card not found.' };
    }
    
    revalidatePath('/');
    return { success: true, updatedStatus: newStatus };
  } catch (error) {
    console.error(`Error updating card status to ${newStatus}:`, error);
    return { success: false, error: 'Failed to update card status.' };
  }
}

// Update card order
type OrderUpdate = { id: string; order: number };

export async function updateCardsOrder(orderedUpdates: OrderUpdate[]): Promise<ActionResponse> {
  if (!Array.isArray(orderedUpdates) || orderedUpdates.length === 0) {
    return { success: false, error: 'Invalid order data provided.' };
  }

  try {
    await connectDB();

    const bulkOps = orderedUpdates.map(update => ({
      updateOne: {
        filter: { _id: update.id },
        update: { $set: { order: update.order } }
      }
    }));

    const result = await CardModel.bulkWrite(bulkOps);

    if (result.ok) {
      return { success: true };
    } else {
      console.error('Bulk update failed:', result);
      return { success: false, error: 'Some order updates may have failed.' };
    }
  } catch (error) {
    console.error('Error updating card order:', error);
    return { success: false, error: 'Failed to save new card order.' };
  }
}

// Delete a card permanently
export async function deleteCard(cardId: string): Promise<ActionResponse> {
  if (!cardId) {
    return { success: false, error: 'Invalid card ID provided.' };
  }

  try {
    await connectDB();
    
    const result = await CardModel.findByIdAndDelete(cardId);
    
    if (!result) {
      return { success: false, error: 'Card not found.' };
    }
    
    revalidatePath('/');
    
    return { 
      success: true, 
      message: 'Card permanently deleted.'
    };
  } catch (error) {
    console.error(`Error deleting card ${cardId}:`, error);
    return { 
      success: false, 
      error: 'Failed to delete card due to a server error.' 
    };
  }
}

