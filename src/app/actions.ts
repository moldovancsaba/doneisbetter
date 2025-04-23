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
      content: content.trim()
    };

    // Simulate network delay for demo purposes
    await new Promise(resolve => setTimeout(resolve, 500));

    return newCard;
  } catch (error) {
    console.error('Error creating card:', error);
    throw new Error('Failed to create card. Please try again.');
  }
}
