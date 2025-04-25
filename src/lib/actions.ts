'use server';

import { Card, CardStatus } from "../app/types/card"; // Ensure path is correct
import { getCardModel, CardDocument } from "@/lib/models/Card";
import { UserDocument } from "@/lib/models/User";
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/db'; // Use correct import
import { revalidatePath } from 'next/cache'; // For potential cache invalidation

// --- CREATE CARD ---
/**
 * Creates a new card with the given content for the authenticated user.
 * @param content - The text content for the new card.
 * @returns {Promise<Card>} The newly created card object.
 * @throws Error if user is not authenticated, content is invalid, or creation fails.
 */
export async function createCard(content: string): Promise<Card> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('User not authenticated');
  }
  const userId = session.user.id;

  // Validate input
  if (!content || content.trim() === '') {
    throw new Error('Card content cannot be empty');
  }
  if (content.length > 500) {
    throw new Error('Card content cannot exceed 500 characters');
  }

  try {
    await connectDB(); // Ensure DB connection
    const CardModel = await getCardModel();

    // Count existing cards to determine order
    const userTodoCardsCount = await CardModel.countDocuments({ user: userId, status: 'TODO', isDeleted: { $ne: true } });

    const cardDocument = await CardModel.create({
      content: content.trim(),
      status: 'TODO' as CardStatus,
      order: userTodoCardsCount,
      user: userId
    });

    revalidatePath('/'); // Invalidate cache for the main page

    return {
      id: cardDocument._id.toString(),
      content: cardDocument.content,
      status: cardDocument.status,
      order: cardDocument.order,
      createdAt: cardDocument.createdAt.toISOString()
    };
  } catch (error) {
    console.error('Error creating card:', error);
    throw new Error('Failed to create card. Please try again.');
  }
}

// --- GET USER'S CARDS ---
/**
 * Retrieves non-deleted cards for the authenticated user.
 * @param {string} userId - The ID of the user whose cards to fetch.
 * @returns {Promise<Card[]>} Array of cards belonging to the user.
 * @throws Error if fetch fails.
 */
export async function getCards(userId: string): Promise<Card[]> {
  // Removed session check here, assuming it's done in page.tsx or API route
  if (!userId) {
      throw new Error("User ID required to fetch cards");
  }

  try {
    await connectDB();
    const CardModel = await getCardModel();
    // Find non-deleted cards for the specific user
    const cards = await CardModel.find({ user: userId, isDeleted: { $ne: true } })
                                 .sort({ status: 1, order: 1 });

    return cards.map((card: CardDocument) => ({
      id: card._id.toString(),
      content: card.content,
      status: card.status,
      order: card.order,
      createdAt: card.createdAt.toISOString()
    }));
  } catch (error) {
    console.error('Error fetching user cards:', error);
    throw new Error('Failed to fetch cards. Please try again.');
  }
}


// --- GET ALL CARDS (ADMIN) ---
/**
 * Retrieves all non-deleted cards for all users (Admin only).
 * Populates user information (name, image) for display.
 * @returns {Promise<Card[]>} Array of all non-deleted cards with user details.
 * @throws Error if user is not admin or fetch fails.
 */
export async function getAllCards(): Promise<Card[]> {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required to view all cards');
  }

  try {
    await connectDB();
    const CardModel = await getCardModel();
    const cardDocuments = await CardModel.find({ isDeleted: { $ne: true } })
                                         .populate<{ user: Pick<UserDocument, 'name' | 'image'> | null }>('user', 'name image')
                                         .sort({ createdAt: -1 }); // Sort by creation date or other relevant field

    return cardDocuments.map((doc) => {
      type PopulatedCardDocument = Omit<CardDocument, 'user'> & {
        user: Pick<UserDocument, 'name' | 'image'> | null;
        _id: mongoose.Types.ObjectId; // Ensure _id is typed
      };
      const typedDoc = doc as PopulatedCardDocument;

      return {
        id: typedDoc._id.toString(),
        content: typedDoc.content,
        status: (doc.status as CardStatus) || 'TODO', // Keep status, add fallback
        order: typeof doc.order === 'number' ? doc.order : 0,
        createdAt: doc.createdAt?.toISOString() || new Date().toISOString(),
        userName: (doc as any).user?.name || 'Unknown User', // Add user details with fallback
        userImage: typedDoc.user?.image // Keep this correct one
      };
    });
  } catch (error) {
    console.error('Error fetching all cards:', error);
    throw new Error('Failed to fetch all cards. Please try again.');
  }
}

// --- GET DELETED CARDS ---
/**
 * Retrieves soft-deleted cards for the authenticated user.
 * @param {string} userId - The ID of the user whose deleted cards to fetch.
 * @returns {Promise<Card[]>} Array of deleted cards belonging to the user.
 * @throws Error if user is not authenticated or fetch fails.
 */
export async function getDeletedCards(userId: string): Promise<Card[]> {
    const session = await getServerSession(authOptions);
    // Security check: Ensure the session user matches the requested userId
    if (session?.user?.id !== userId) {
      console.warn(`Unauthorized attempt to fetch deleted cards for user ${userId} by session user ${session?.user?.id}`);
      return []; // Return empty if not authorized
    }

    try {
      await connectDB();
      const CardModel = await getCardModel();
      const cardDocuments = await CardModel.find({
          user: userId,
          isDeleted: true
        })
        .populate<{ user: Pick<UserDocument, 'name' | 'image'> | null }>('user', 'name image') // Populate user details
        .sort({ deletedAt: -1 }); // Sort by deletion date

      return cardDocuments.map((doc) => ({
        id: doc._id.toString(),
        content: doc.content,
        status: doc.status, // Keep status
        order: doc.order,
        createdAt: doc.createdAt.toISOString()
        // deletedAt: doc.deletedAt?.toISOString() // Optional
      }));
    } catch (error) {
      console.error('Error fetching deleted cards:', error);
      throw new Error('Failed to fetch deleted cards. Please try again.');
    }
}

// --- UPDATE CARD STATUS/ORDER ---
/**
 * Updates the status and/or order of a card.
 * Allows admin to update any card, others only their own.
 * @param {string} cardId - The ID of the card to update.
 * @param {CardStatus} status - The new status for the card.
 * @param {string} userId - The ID of the user initiating the update (for permission check).
 * @param {number} [order] - The new order position (optional).
 * @returns {Promise<Card | null>} The updated card object or null if not found/authorized.
 * @throws Error if update fails.
 */
export async function updateCardStatus(
  cardId: string,
  status: CardStatus,
  userId: string, // Added userId for permissions
  order?: number
): Promise<Card | null> {
  const session = await getServerSession(authOptions);
  if (session?.user?.id !== userId) {
      throw new Error("Session user ID does not match provided user ID for update");
  }

  if (!cardId || !mongoose.Types.ObjectId.isValid(cardId)) {
    throw new Error('Invalid Card ID provided');
  }

  try {
    await connectDB();
    const CardModel = await getCardModel();

    const updateData: { status: CardStatus; order?: number } = { status };
    if (order !== undefined && order >= 0) {
      updateData.order = order;
    }

    // Determine query based on user role
    const isAdmin = session?.user?.role === 'admin';
    const query = isAdmin ? { _id: cardId } : { _id: cardId, user: userId };

    const updatedCard = await CardModel.findOneAndUpdate(
      query,
      updateData,
      { new: true }
    );

    if (!updatedCard) {
      console.warn(`Update failed: Card ${cardId} not found or user ${userId} not authorized.`);
      return null;
    }

    revalidatePath('/'); // Invalidate cache

    return {
      id: updatedCard._id.toString(),
      content: updatedCard.content,
      status: updatedCard.status,
      order: updatedCard.order,
      createdAt: updatedCard.createdAt.toISOString()
    };
  } catch (error) {
    console.error('Error updating card status/order:', error);
    throw new Error('Failed to update card. Please try again.');
  }
}

// --- SOFT DELETE CARD ---
/**
 * Soft deletes a card by setting its isDeleted flag to true.
 * Allows admin to delete any card, others only their own.
 * @param {string} cardId - The ID of the card to soft delete.
 * @param {string} userId - The ID of the user initiating the deletion.
 * @returns {Promise<{ success: boolean; message?: string }>} Result object.
 * @throws Error if deletion fails.
 */
export async function softDeleteCard(cardId: string, userId: string): Promise<{ success: boolean; message?: string }> {
    const session = await getServerSession(authOptions);
    if (session?.user?.id !== userId) {
        return { success: false, message: 'Session user ID mismatch' };
    }

    if (!cardId || !mongoose.Types.ObjectId.isValid(cardId)) {
        return { success: false, message: `Invalid card ID format: ${cardId}` };
    }

    try {
        await connectDB();
        const CardModel = await getCardModel();

        const isAdmin = session?.user?.role === 'admin';
        const query = isAdmin ? { _id: cardId } : { _id: cardId, user: userId };

        const deletedCard = await CardModel.findOneAndUpdate(
            query,
            { isDeleted: true, deletedAt: new Date() },
            { new: true }
        );

        if (!deletedCard) {
            return { success: false, message: 'Card not found or permission denied' };
        }

        console.log(`Card ${cardId} soft deleted by user ${userId}`);
        revalidatePath('/'); // Invalidate cache

        return { success: true };

    } catch (error) {
        console.error('Error soft deleting card:', error);
        return { success: false, message: 'Failed to delete card. Please try again.' };
    }
}
