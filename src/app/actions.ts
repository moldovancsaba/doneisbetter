'use server';

import { Card, CardStatus } from "./types/card";
import { getCardModel, CardDocument } from "@/lib/models/Card"; // Use alias for lib/models
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth/next';
// Assuming authOptions is exported from the NextAuth route handler
// Adjust the path if your file structure is different
import { authOptions } from '@/lib/authOptions';

/**
 * Creates a new card with the given content
 * 
 * @param content - The text content for the new card
 * @returns The newly created card object
 * @throws Error if content is empty or invalid
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
      order: userTodoCardsCount, // Place at the end of the user's TODO cards
      user: userId // Associate with the logged-in user
    });
    
    // Return in the format expected by the frontend
    return {
      id: cardDocument._id.toString(),
      content: cardDocument.content,
      status: cardDocument.status,
      order: cardDocument.order
    };
  } catch (error) {
    console.error('Error creating card:', error);
    throw new Error('Failed to create card. Please try again.');
  }
}

/**
 * Updates a card's status and order
 * 
 * @param cardId - The ID of the card to update
 * @param newStatus - The new status to assign to the card
 * @param order - The new order position of the card
 * @returns The updated card object
 * @throws Error if the card cannot be found or updated
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
 * Retrieves all cards from the database
 * 
 * @returns Array of cards
 */
export async function getCards(): Promise<Card[]> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    // Return empty array for unauthenticated users, or throw error depending on desired behavior
    return []; 
    // throw new Error('User not authenticated'); 
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
