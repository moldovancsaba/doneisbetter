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
    // ADDED: Order field
    order: {
      type: Number,
      required: true,
      default: 0 // Default will be overridden on create
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

  // Optional: Add index for sorting performance
  cardSchema.index({ status: 1, order: 1 });

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
    // Use negative timestamp for default order (newest first visually if sorted ascending)
    const defaultOrder = -Date.now();
    await CardModel.create({
        content: data.content.trim(),
        order: defaultOrder // Set the order field
    });
    revalidatePath('/');
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
    await connectDB(); // Ensure connection before query
    const cards = await CardModel.find({})
        .sort({ order: 1 }) // Single sort by order
        .lean();
    // Map to serializable plain objects
    return cards.map(card => ({
        id: card._id.toString(), // Ensure ID is included and stringified
        content: card.content,
        status: card.status,
        order: card.order,
        createdAt: card.createdAt.toISOString() // Serialize Date
    }));
  // Catch block correctly placed
  } catch (error) {
    console.error('Error fetching cards:', error);
    return []; // Return empty array on error
  }
}

// updateCardStatus (with corrected structure and await connectDB)
export async function updateCardStatus(cardId, newStatus) {
   if (!cardId || !['active', 'done', 'deleted'].includes(newStatus)) {
     return { success: false, error: 'Invalid status provided.' };
   }
   try {
     await connectDB(); // Ensure connection
     const updatedCard = await CardModel.findByIdAndUpdate(cardId, { status: newStatus }, { new: true });
     if (!updatedCard) { return { success: false, error: 'Card not found.' }; }
     revalidatePath('/');
     return { success: true, updatedStatus: newStatus };
   } catch (error) {
     console.error(`Error updating card status to ${newStatus}:`, error);
     return { success: false, error: 'Failed to update card status.' };
   }
} // CORRECTED: Correct closing brace for the function

// ADDED: New Server Action to Update Card Order
export async function updateCardsOrder(orderedUpdates) {
  // orderedUpdates = [{ id: 'cardId1', order: 0 }, { id: 'cardId2', order: 1 }, ...]
  if (!Array.isArray(orderedUpdates) || orderedUpdates.length === 0) {
    return { success: false, error: 'Invalid order data provided.' };
  }

  try {
    await connectDB();

    // Prepare bulk operations
    const bulkOps = orderedUpdates.map(update => ({
      updateOne: {
        filter: { _id: update.id },
        // Update only the order field
        update: { $set: { order: update.order } }
      }
    }));

    // Execute bulk write
    const result = await CardModel.bulkWrite(bulkOps);

    console.log('Bulk update result:', result);

    // Check bulk write result (optional but good practice)
    if (result.ok) {
      // No need to revalidate path as order changes are primarily visual client-side first
      // revalidatePath('/'); // Uncomment if server-fetched order needs immediate refresh elsewhere
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
