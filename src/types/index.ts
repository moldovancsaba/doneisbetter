import { Document } from 'mongoose';

/**
 * Interface for Card data
 */
export interface ICard {
  content: string;
  createdAt: Date;
}

/**
 * Interface for Card document with Mongoose properties
 */
export interface ICardDocument extends ICard, Document {
  id: string; // Virtual id field (from _id)
}

/**
 * API response for card operations
 */
export interface CardApiResponse {
  success: boolean;
  data?: ICard | ICard[];
  error?: string;
}

/**
 * Form submission for creating a new card
 */
export interface CardFormData {
  content: string;
}

