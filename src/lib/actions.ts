'use server';

import { connectDB } from '@/lib/db';
import CardModel, { CardDocument, getCardModel } from '@/lib/models/Card';
import { revalidatePath } from 'next/cache';
import { CardStatus, Card } from '@/app/types/card'; // Ensure types are imported

// Simplified: Get all non-deleted cards (no user filtering)
export async function getCards(userId?: string): Promise<Card[]> { // userId param kept for compatibility, but ignored
  try {
    await connectDB();
    const CardModel = await getCardModel();
    const cards = await CardModel.find({ isDeleted: { $ne: true } })
      .sort({ order: 1, createdAt: -1 }) // Sort by order, then by creation date
      .lean();

    return cards.map(card => ({
      id: card._id.toString(),
      content: card.content || '',
      status: card.status || 'TODO',
      order: card.order || 0,
      createdAt: card.createdAt?.toISOString() || '',
      // user field removed
    }));
  } catch (error) {
    console.error("Error fetching cards:", error);
    throw new Error("Failed to fetch cards.");
  }
}

// Simplified: Get all deleted cards (no user filtering)
export async function getDeletedCards(userId?: string): Promise<Card[]> { // userId param kept for compatibility, but ignored
  try {
    await connectDB();
    const CardModel = await getCardModel();
    const cards = await CardModel.find({ isDeleted: true })
      .sort({ deletedAt: -1 }) // Sort by deletion date
      .lean();

    return cards.map(card => ({
      id: card._id.toString(),
      content: card.content || '',
      status: card.status || 'TODO',
      order: card.order || 0,
      createdAt: card.createdAt?.toISOString() || '',
      // user field removed
    }));
  } catch (error) {
    console.error("Error fetching deleted cards:", error);
    throw new Error("Failed to fetch deleted cards.");
  }
}

// Simplified: Update card status and order (no user check)
export async function updateCardStatus(
  cardId: string,
  newStatus: CardStatus,
  userId?: string, // Ignored
  newOrder?: number
): Promise<Card> {
  try {
    await connectDB();
    const CardModel = await getCardModel();
    const updateData: Partial<CardDocument> = { status: newStatus };
    if (newOrder !== undefined) {
      updateData.order = newOrder;
    }

    const updatedCard = await CardModel.findByIdAndUpdate(
      cardId,
      updateData,
      { new: true, runValidators: true }
    ).lean();

    if (!updatedCard) {
      throw new Error("Card not found");
    }

    revalidatePath('/');
    return {
      id: updatedCard._id.toString(),
      content: updatedCard.content || '',
      status: updatedCard.status || 'TODO',
      order: updatedCard.order || 0,
      createdAt: updatedCard.createdAt?.toISOString() || '',
    };
  } catch (error) {
    console.error("Error updating card status:", error);
    throw new Error("Failed to update card status.");
  }
}

// Simplified: Create card (no user association)
export async function createCard(content: string, userId?: string): Promise<Card> { // userId ignored
  if (!content || content.trim().length === 0) {
    throw new Error('Card content cannot be empty');
  }

  try {
    await connectDB();
    const CardModel = await getCardModel();

    // Calculate the order for the new card (e.g., place it at the beginning)
    // Using negative timestamp ensures newest are first when sorted ascending by order
    const order = -Date.now();

    const newCard = await CardModel.create({
      content: content.trim(),
      status: 'TODO', // Default status
      order: order,
      // user field removed
    });

    revalidatePath('/');
    return {
      id: newCard._id.toString(),
      content: newCard.content,
      status: newCard.status,
      order: newCard.order,
      createdAt: newCard.createdAt.toISOString(),
    };
  } catch (error) {
    console.error("Error creating card:", error);
    throw new Error("Failed to create card.");
  }
}

// Simplified: Soft delete card (no user check)
export async function softDeleteCard(cardId: string, userId?: string): Promise<{ success: boolean }> { // userId ignored
  try {
    await connectDB();
    const CardModel = await getCardModel();
    const result = await CardModel.findByIdAndUpdate(cardId, {
      isDeleted: true,
      deletedAt: new Date(),
    });

    if (!result) {
      throw new Error("Card not found");
    }

    revalidatePath('/');
    revalidatePath('/?view=deleted'); // Revalidate deleted view
    return { success: true };
  } catch (error) {
    console.error("Error soft deleting card:", error);
    throw new Error("Failed to soft delete card.");
  }
}

// Removed getAllCards function
