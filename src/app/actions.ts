'use server';

import { Card, CardStatus } from "./types/card";
import { getCardModel, CardDocument } from "./models/Card";
import mongoose from 'mongoose';

/**
 * Creates a new card with the given content
 * 
 * @param content - The text content for the new card
 * @returns The newly created card object
 * @throws Error if content is empty or invalid
 */
export async function createCard(content: string): Promise<Card> {
  // Validate input
  if (!content || content.trim() === '') {
    throw new Error('Card content cannot be empty');
  }

  if (content.length > 500) {
    throw new Error('Card content cannot exceed 500 characters');
  }

  try {
    // Get the Card model with an active database connection
    const CardModel = await getCardModel();
    
    // Count existing cards to determine order 
    // (new cards should appear at the top of the TODO column)
    const todoCardsCount = await CardModel.countDocuments({ status: 'TODO' });
    
    // Create a new card document
    const cardDocument = await CardModel.create({
      content: content.trim(),
      status: 'TODO' as CardStatus,
      order: todoCardsCount // Place at the end of TODO cards
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
    
    // Get the Card model with an active database connection
    const CardModel = await getCardModel();
    // Use the model's updateCardStatus method which handles typing
    const updatedCard = await CardModel.updateCardStatus(cardId, newStatus, order);
    
    if (!updatedCard) {
      throw new Error(`Card with ID ${cardId} not found`);
    }
    
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
  try {
    const CardModel = await getCardModel();
    // Use the model's findCards method which handles document conversion
    return await CardModel.findCards();
  } catch (error) {
    console.error('Error fetching cards:', error);
    throw new Error('Failed to fetch cards. Please try again.');
  }
}
