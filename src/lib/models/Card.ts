import mongoose, { Schema, Document, Model } from 'mongoose';
import { CardStatus } from '@/app/types/card'; // Keep this alias if types/card.ts remains in app
import { connectToDatabase } from '@/lib/db'; // Updated path
import { UserDocument } from '@/lib/models/User'; // Updated path

/**
 * MongoDB document interface for Card
 * Extends Document to add MongoDB-specific fields
 */
export interface CardDocument extends Document {
  _id: mongoose.Types.ObjectId;  // Explicitly define _id type
  content: string;
  status: CardStatus;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  user: mongoose.Types.ObjectId; // Reference to User
  isDeleted: boolean; // Added for soft delete
  deletedAt?: Date; // Added for soft delete timestamp
}

/**
 * MongoDB schema for Card
 */
const CardSchema = new Schema<CardDocument>(
  {
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
      maxlength: [500, 'Content cannot be more than 500 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['TODO', 'IN_PROGRESS', 'DONE'],
        message: '{VALUE} is not a valid status',
      },
      default: 'TODO',
    },
    order: {
      type: Number,
      default: 0,
      min: [0, 'Order must be a non-negative number'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true // Add index for querying by user
    },
    isDeleted: { // Add isDeleted field
      type: Boolean,
      default: false,
      index: true // Index for querying deleted items
    },
    deletedAt: { // Add deletedAt field
      type: Date,
      default: null 
    }
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Add indexes for efficient querying and sorting
CardSchema.index({ user: 1, isDeleted: 1, status: 1, order: 1 }); // Updated index for main view filtering
CardSchema.index({ user: 1, isDeleted: 1 }); // Index for finding user's deleted/non-deleted
CardSchema.index({ createdAt: -1 }); // For sorting by creation date
// Optional: Index for TTL (Time-To-Live) for automatic hard delete after 30 days
// CardSchema.index({ deletedAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 }); 

/**
 * Methods for Card model
 */
interface CardModel extends Model<CardDocument> {
  /**
   * Finds cards for a specific user and returns them in a format compatible with the frontend Card type
   */
  findCardsByUser(userId: string): Promise<Array<{
    id: string; // Ensure id is included in return type
    content: string;
    status: CardStatus;
    order: number;
    createdAt: string; // Changed to string for ISO format
  }>>;
  
  /**
   * Updates a card's status and/or order
   */
  updateCardStatus(
    id: string,
    userId: string,
    status: CardStatus,
    order?: number
  ): Promise<{
    id: string;
    content: string;
    status: CardStatus;
    order: number;
    createdAt: string; // Changed to string
  } | null>;
}

// Add static methods to the schema
CardSchema.statics.findCardsByUser = async function(userId: string): Promise<any[]> {
  if (!userId) {
    throw new Error("User ID is required to find cards");
  }
  // Filter out deleted cards
  const cards = await this.find({ user: userId, isDeleted: { $ne: true } }).sort({ status: 1, order: 1 });
  
  // Convert MongoDB documents to frontend-compatible objects
  return cards.map((card: CardDocument) => ({
    id: card._id.toString(),
    content: card.content,
    status: card.status,
    order: card.order,
    createdAt: card.createdAt.toISOString() // Convert to ISO string
  }));
};

CardSchema.statics.updateCardStatus = async function(
  id: string,
  userId: string,
  status: CardStatus,
  order?: number
): Promise<any> {
  if (!userId) {
    throw new Error("User ID is required to update card status");
  }
  try {
    // Build update object based on provided fields
    const updateData: { status?: CardStatus; order?: number } = {};
    updateData.status = status;
    if (order !== undefined) {
      updateData.order = order;
    }
    
    // Find and update the card, ensuring it belongs to the user
    const updatedCard = await this.findOneAndUpdate(
      { _id: id, user: userId }, // Filter by card ID and user ID
      updateData,
      { new: true } // Return the updated document
    );
    
    if (!updatedCard) {
      return null; // Card not found or user doesn't own it
    }
    
    // Convert to frontend-compatible object
    return {
      id: updatedCard._id.toString(), // Add id
      content: updatedCard.content,   // Add content
      status: updatedCard.status,
      order: updatedCard.order,
      createdAt: updatedCard.createdAt.toISOString() // Convert to ISO string
    };
  } catch (error) {
    console.error('Error updating card status:', error);
    throw error;
  }
};

// Create or retrieve the model
// This pattern prevents "Cannot overwrite model once compiled" errors in development
let CardModel: CardModel;

try {
  // Try to retrieve existing model
  CardModel = mongoose.model<CardDocument, CardModel>('Card');
} catch {
  // Or create a new one if it doesn't exist
  CardModel = mongoose.model<CardDocument, CardModel>('Card', CardSchema);
}

/**
 * Wrapper around CardModel to ensure database connection
 */
export async function getCardModel(): Promise<CardModel> {
  await connectToDatabase();
  return CardModel;
}

export default CardModel;

