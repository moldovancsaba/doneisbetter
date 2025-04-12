import mongoose, { Schema, Document, Model } from 'mongoose';
import { ICard } from '@/types';

// Mongoose schema for Card documents
const CardSchema = new Schema<ICard>({
  content: { 
    type: String, 
    required: [true, 'Content is required'],
    trim: true,
    maxlength: [500, 'Content cannot be more than 500 characters']
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
  toJSON: {
    transform: (_, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Create and export the Card model
// Using this pattern to handle Next.js hot reloading
// This prevents "Model is already defined" errors
const Card = (mongoose.models.Card as Model<ICard & Document>) || 
  mongoose.model<ICard & Document>('Card', CardSchema);

export default Card;

