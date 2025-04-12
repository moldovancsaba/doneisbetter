'use server';

import { connectDB } from '@/lib/db';
import { Card, CardInput } from '@/types';
import mongoose from 'mongoose';
import { revalidatePath } from 'next/cache';

// Card Schema
const cardSchema = new mongoose.Schema({
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Get or create model
const CardModel = mongoose.models.Card || mongoose.model('Card', cardSchema);

// Get all cards
export async function getCards(): Promise<Card[]> {
  try {
    await connectDB();
    const cards = await CardModel.find().sort({ createdAt: -1 });
    
    return cards.map(card => ({
      id: card._id.toString(),
      content: card.content,
      createdAt: card.createdAt
    }));
  } catch (error) {
    console.error('Error fetching cards:', error);
    throw new Error('Failed to fetch cards');
  }
}

// Create new card
export async function createCard(data: CardInput): Promise<Card> {
  if (!data.content.trim()) {
    throw new Error('Content is required');
  }
  
  try {
    await connectDB();
    const card = await CardModel.create(data);
    
    // Revalidate the page to show the new card
    revalidatePath('/');
    
    return {
      id: card._id.toString(),
      content: card.content,
      createdAt: card.createdAt
    };
  } catch (error) {
    console.error('Error creating card:', error);
    throw new Error('Failed to create card');
  }
}
