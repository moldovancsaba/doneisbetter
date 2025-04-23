'use server';

import { Card, CardStatus } from "./types/card";
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

  if (content.length > 200) {
    throw new Error('Card content cannot exceed 200 characters');
  }

  try {
    // Create a unique ID (in a real app, this would come from a database)
    const id = `card-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    // In a real app, this would save to a database
    const newCard: Card = {
      id,
      content: content.trim(),
      status: 'TODO' // Default status for new cards
    };

    // Simulate network delay for demo purposes
    await new Promise(resolve => setTimeout(resolve, 500));

    return newCard;
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
    
    // In a real app, this would find the card in the database
    // For this demo, we're checking initialCards from lib/data.ts
    const { initialCards } = await import('./lib/data');
    const existingCard = initialCards.find(card => card.id === cardId);
    
    if (!existingCard) {
      throw new Error(`Card with ID ${cardId} not found`);
    }
    
    // Simulate network delay for demo purposes
    await new Promise<void>(resolve => setTimeout(resolve, 300));
    
    // Return the updated card object, preserving existing content
    return {
      id: cardId,
      content: existingCard.content,
      status: newStatus,
      order: order
    };
  } catch (error) {
    console.error('Error updating card status or order:', error);
    throw new Error('Failed to update card. Please try again.');
  }
}
