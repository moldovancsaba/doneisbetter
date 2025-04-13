'use server';

import { connectDB } from '@/lib/db'; // Ensure this path is correct
import mongoose from 'mongoose';
import { revalidatePath } from 'next/cache';

// Define Card Schema if not already defined to prevent recompilation error in dev
if (!mongoose.models.Card) {
  const cardSchema = new mongoose.Schema({
    content: {
      type: String,
      required: [true, 'Card content cannot be empty.'],
      trim: true,
      maxlength: [500, 'Content cannot exceed 500 characters.']
    },
    // Add status field with default 'active'
    status: {
      type: String,
      enum: ['active', 'done', 'deleted'], // Allowed statuses
      default: 'active'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  mongoose.model('Card', cardSchema);
}

const CardModel = mongoose.model('Card');

// Server action to create a new card
export async function createCard(data) {
  if (!data || typeof data.content !== 'string' || !data.content.trim()) {
      return { success: false, error: 'Invalid input: Content is required.' };
  }

  try {
    await connectDB();
    // Status defaults to 'active' via schema
    await CardModel.create({ content: data.content.trim() });
    revalidatePath('/'); // Trigger data refresh
    return { success: true };
  } catch (error) {
    console.error('Error creating card:', error);
    // Check for validation errors
    if (error.name === 'ValidationError') {
        // Extract specific validation messages if needed
        return { success: false, error: error.message };
    }
    // Return a generic, serializable error object for other errors
    return { success: false, error: 'Failed to save card due to a server error.' };
  }
}

// Server action to get all cards, sorted by newest
export async function getCards() {
  try {
    await connectDB();
    // Remove the { status: 'active' } filter - Fetch all cards
    const cards = await CardModel.find({}).sort({ createdAt: -1 }).lean(); // Fetch all
    // Convert Mongoose documents to plain objects including converting _id and Date
    return cards.map(card => ({
        id: card._id.toString(),
        content: card.content,
        status: card.status, // Now status is important for client-side filtering
        // Ensure createdAt is serializable (ISO string is safe)
        createdAt: card.createdAt.toISOString()
    }));
  } catch (error) {
    console.error('Error fetching cards:', error);
    // In a real app, you might want to throw or handle this more gracefully
    return []; // Return empty array on error
  }
}

// Update Card Status Action - MODIFIED to accept any valid status
export async function updateCardStatus(cardId, newStatus) {
  // Validate input - Allow 'active', 'done', 'deleted'
  if (!cardId || !['active', 'done', 'deleted'].includes(newStatus)) {
    return { success: false, error: 'Invalid status provided.' };
  }

  try {
    await connectDB();
    const updatedCard = await CardModel.findByIdAndUpdate(
        cardId,
        { status: newStatus },
        { new: true } // Return the updated document
    );

    if (!updatedCard) {
        return { success: false, error: 'Card not found.' };
    }

    revalidatePath('/'); // Revalidate to update the list on hard refresh/navigation
    // Return the updated status along with success
    return { success: true, updatedStatus: newStatus };
  } catch (error) {
    console.error(`Error updating card status to ${newStatus}:`, error);
    return { success: false, error: 'Failed to update card status.' };
  }
}
