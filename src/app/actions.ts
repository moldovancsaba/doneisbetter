'use server';

import { Card } from "./types/card";

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
 * Updates a card's status
 * 
 * @param cardId - The ID of the card to update
 * @param newStatus - The new status to assign to the card
 * @returns The updated card object
 * @throws Error if the card cannot be found or updated
 */
export async function updateCardStatus(cardId: string, newStatus: string): Promise<Card> {
  try {
    // Validate input
    if (!cardId) {
      throw new Error('Card ID is required');
    }
    
    if (!['TODO', 'IN_PROGRESS', 'DONE'].includes(newStatus)) {
      throw new Error('Invalid status value');
    }
    
    // In a real app, this would update the database
    // For this demo, we're simulating a successful update
    
    // Simulate network delay for demo purposes
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Return the "updated" card object
    // In a real app, this would be fetched from the database
    return {
      id: cardId,
      content: 'Card content', // This would be populated from the database
      status: newStatus as any
    };
  } catch (error) {
    console.error('Error updating card status:', error);
    throw new Error('Failed to update card status. Please try again.');
  }
}
