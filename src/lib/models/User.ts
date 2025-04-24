import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * MongoDB document interface for User
 */
export interface UserDocument extends Document {
  email: string;
  name: string;
  image?: string;
  role: string;
  googleId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * MongoDB schema for User
 */
const UserSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    image: String,
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    googleId: {
      type: String,
      required: [true, 'Google ID is required'],
      unique: true,
    }
  },
  {
    timestamps: true,
  }
);

// Note: `unique: true` in the schema definition already creates unique indexes for email and googleId.
// Explicit `UserSchema.index()` calls are not needed for these fields.

const UserModel = mongoose.model<UserDocument>('User', UserSchema);

export async function getUserModel(): Promise<typeof UserModel> {
  // Database connection is handled by connectDB() function
  // If not, uncomment the line below:
  // await mongoose.connect(process.env.MONGODB_URI!); 
  return UserModel;
}

export default UserModel;

