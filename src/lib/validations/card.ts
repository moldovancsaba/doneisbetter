import { z } from 'zod';
import { CardStatusEnum } from '../models/Card';

/**
 * Zod schema for Card validation
 * Validates the data structure and types for card operations
 */
export const cardSchema = z.object({
  content: z
    .string()
    .min(1, { message: 'Card content is required' })
    .max(1000, { message: 'Card content cannot exceed 1000 characters' })
    .trim(),
  
  status: z
    .enum([
      CardStatusEnum.TODO,
      CardStatusEnum.IN_PROGRESS,
      CardStatusEnum.DONE,
      CardStatusEnum.Q1,
      CardStatusEnum.Q2,
      CardStatusEnum.Q3,
      CardStatusEnum.Q4
    ], { 
      message: 'Invalid card status' 
    })
    .default(CardStatusEnum.TODO),
  
  order: z
    .number()
    .int({ message: 'Order must be an integer' })
    .default(0),
  
  importance: z
    .boolean()
    .default(false),
  
  urgency: z
    .boolean()
    .default(false),
  
  isDeleted: z
    .boolean()
    .default(false)
    .optional(),
  
  deletedAt: z
    .date()
    .nullable()
    .optional()
});

/**
 * Schema for card creation requests
 */
export const createCardSchema = z.object({
  content: z
    .string()
    .min(1, { message: 'Card content is required' })
    .max(1000, { message: 'Card content cannot exceed 1000 characters' })
    .trim(),
  
  importance: z
    .boolean()
    .default(false)
    .optional(),
  
  urgency: z
    .boolean()
    .default(false)
    .optional()
});

/**
 * Schema for card update operations
 */
export const updateCardSchema = z.object({
  cardId: z
    .string()
    .min(1, { message: 'Card ID is required' }),
  
  status: z
    .enum([
      CardStatusEnum.TODO,
      CardStatusEnum.IN_PROGRESS,
      CardStatusEnum.DONE,
      CardStatusEnum.Q1,
      CardStatusEnum.Q2,
      CardStatusEnum.Q3,
      CardStatusEnum.Q4
    ], { 
      message: 'Invalid card status' 
    })
    .optional(),
  
  order: z
    .number()
    .int({ message: 'Order must be an integer' })
    .optional(),
  
  importance: z
    .boolean()
    .optional(),
  
  urgency: z
    .boolean()
    .optional()
});

/**
 * Schema for soft-deleting a card
 */
export const deleteCardSchema = z.object({
  cardId: z
    .string()
    .min(1, { message: 'Card ID is required' })
});

// Export types derived from the schemas
export type CardInput = z.infer<typeof cardSchema>;
export type CreateCardInput = z.infer<typeof createCardSchema>;
export type UpdateCardInput = z.infer<typeof updateCardSchema>;
export type DeleteCardInput = z.infer<typeof deleteCardSchema>;

