'use server';

import { Card, CardStatus } from "../app/types/card"; // Corrected path
import { getCardModel, CardDocument } from "@/lib/models/Card";
import { UserDocument } from "@/lib/models/User"; // Import UserDocument
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';

/**
 * Creates a new card with the given content for the authenticated user
 * 
 * @param content - The text content for the new card
 * @returns The newly created card object
 * @throws Error if content is empty, invalid, or user is not authenticated
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
    const CardModel = await getCardModel();
    
    // Count existing cards for the user to determine order
    const userTodoCardsCount = await CardModel.countDocuments({ user: userId, status: 'TODO' });
    
    // Create a new card document associated with the user
    const cardDocument = await CardModel.create({
      content: content.trim(),
      status: 'TODO' as CardStatus,
      order: userTodoCardsCount, 
      user: userId 
    });
    
    // Return in the format expected by the frontend
    return {
      id: cardDocument._id.toString(),
      content: cardDocument.content,
      status: cardDocument.status,
      order: cardDocument.order,
      createdAt: cardDocument.createdAt.toISOString() // Include createdAt
    };
  } catch (error) {
    console.error('Error creating card:', error);
    throw new Error('Failed to create card. Please try again.');
  }
}

/**
 * Updates a card's status and order for the authenticated user
 * 
 * @param cardId - The ID of the card to update
 * @param newStatus - The new status to assign to the card
 * @param order - The new order position of the card
 * @returns The updated card object
 * @throws Error if the card cannot be found, user is not authenticated, or update fails
 */
export async function updateCardStatus(
  cardId: string, 
  newStatus: CardStatus, 
  order?: number
): Promise<Card> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('User not authenticated');
  }
  const userId = session.user.id;

  try {
    // Validate input
    if (!cardId) {
      throw new Error('Card ID is required');
    }
    
    if (!['TODO', 'IN_PROGRESS', 'DONE'].includes(newStatus)) {
      throw new Error('Invalid status value');
    }
    
    if (order !== undefined && (typeof order !== 'number' || order < 0)) {
      throw new Error('Order must be a non-negative number');
    }
    
    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      throw new Error(`Invalid card ID format: ${cardId}`);
    }
    
    const CardModel = await getCardModel();
    // Use the model's static updateCardStatus method
    const updatedCard = await CardModel.updateCardStatus(cardId, userId, newStatus, order);
    
    if (!updatedCard) {
      throw new Error(`Card with ID ${cardId} not found or user does not have permission`);
    }
    
    // The static method already returns the correct format
    return updatedCard;
  } catch (error) {
    console.error('Error updating card status or order:', error);
    throw new Error('Failed to update card. Please try again.');
  }
}

/**
 * Retrieves cards for the authenticated user from the database
 * 
 * @returns {Promise<Card[]>} Array of cards belonging to the user
 * @throws Error if user is not authenticated or fetch fails
 */
export async function getCards(): Promise<Card[]> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    // Return empty array for unauthenticated users
    return []; 
  }
  const userId = session.user.id;

  try {
    const CardModel = await getCardModel();
    // Use the model's static findCardsByUser method
    return await CardModel.findCardsByUser(userId);
  } catch (error) {
    console.error('Error fetching cards:', error);
    throw new Error('Failed to fetch cards. Please try again.');
  }
}

/**
 * Fetches *all* cards from the database, regardless of user.
 * NOTE: This action currently lacks authorization controls and should be
 * secured if used in a production scenario beyond debugging/admin views.
 * @returns {Promise<Card[]>} A promise resolving to an array of all cards, including populated user name and image.
 */
export async function getAllCards(): Promise<Card[]> {
  // Add authorization check here if needed in the future
  // const session = await getServerSession(authOptions);
  // if (!session?.user?.isAdmin) { // Example: Check for admin role
  //   throw new Error('Unauthorized: Admin access required');
  // }

  try {
    const CardModel = await getCardModel();
    // Fetch all cards and populate user's name and image
    const cardDocuments = await CardModel.find({})
                                        .populate<{ user: Pick<UserDocument, 'name' | 'image'> | null }>('user', 'name image') // Populate specific fields
                                        .sort({ status: 1, order: 1 });

    // Convert MongoDB documents to frontend-compatible objects
    return cardDocuments.map((doc) => {
      // Define a type for the populated document structure
      type PopulatedCardDocument = Omit<CardDocument, 'user'> & {
        user: Pick<UserDocument, 'name' | 'image'> | null; 
      };
      // Use the helper type in the assertion
      const typedDoc = doc as PopulatedCardDocument; 
      
      return {
        id: typedDoc._id.toString(), // _id should exist on the base document type
        content: typedDoc.content,
        status: typedDoc.status,
        order: typedDoc.order,
        createdAt: typedDoc.createdAt.toISOString(),
        // Access populated user fields safely
        userName: typedDoc.user?.name,
        userImage: typedDoc.user?.image
      };
    });
    // Removed duplicate return block below
  } catch (error) {
    console.error('Error fetching all cards:', error);
    throw new Error('Failed to fetch all cards. Please try again.');
  }
}
