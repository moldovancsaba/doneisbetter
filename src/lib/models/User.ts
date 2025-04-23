import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * MongoDB document interface for User
 */
export interface UserDocument extends Document {
  email: string;
  name: string;
  image?: string;
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
    image: {
      type: String,
    },
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

interface UserModel extends Model<UserDocument> {}
let UserModel: UserModel;

try {
  UserModel = mongoose.model<UserDocument, UserModel>('User');
} catch {
  UserModel = mongoose.model<UserDocument, UserModel>('User', UserSchema);
}

export async function getUserModel(): Promise<UserModel> {
  // Assuming connectToDatabase is called elsewhere (e.g., in actions)
  // If not, uncomment the line below:
  // await mongoose.connect(process.env.MONGODB_URI!); 
  return UserModel;
}

export default UserModel;

