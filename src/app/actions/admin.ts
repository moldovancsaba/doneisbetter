'use server'

import { Session } from 'next-auth'; // Import Session type
import { getServerSession } from 'next-auth/next'; // Updated import path
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/db';
import User, { getUserModel } from '@/lib/models/User'; // Ensure getUserModel is imported
import { revalidatePath } from 'next/cache';
import CardModel, { getCardModel } from '@/lib/models/Card'; // Add CardModel import
import mongoose from 'mongoose'; // Add mongoose import

// Accept session object as argument
export async function getAllUsers(session: Session | null) {
  // Perform authorization check using the passed session object
  if (session?.user?.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required');
  }

  try {
    console.log("[getAllUsers] Attempting to connect to DB...");
    await connectDB();
    console.log("[getAllUsers] DB Connected. Fetching users...");
    const users = await User.find()
      .select('_id name email role createdAt')
      .sort({ createdAt: -1 })
      .lean();
    console.log(`[getAllUsers] Found ${users.length} users.`);
    return users;
  } catch (error) {
    console.error("[getAllUsers] Error fetching users:", error);
    throw new Error("Failed to fetch users due to server error."); // Re-throw a generic error
  }
}
export async function updateUserRole(userId: string, newRole: 'user' | 'admin') {
  const session = await getServerSession(authOptions);
  
  if (session?.user?.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required');
  }

  if (session.user.id === userId) {
    throw new Error('Cannot modify your own role');
  }

  await connectDB();
  
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { role: newRole },
    { new: true, runValidators: true }
  ).select('_id name email role');

  if (!updatedUser) {
    throw new Error('User not found');
  }

  revalidatePath('/admin');
  return updatedUser;
}

/**
 * Permanently deletes a user and all their associated cards.
 * Only callable by admins. Prevents self-deletion.
 * @param userId The ID of the user to delete.
 * @returns Object indicating success or failure.
 */
export async function deleteUserPermanently(userId: string): Promise<{ success: boolean; message?: string }> {
  const session = await getServerSession(authOptions);

  // 1. Authorization Check: Must be admin
  if (session?.user?.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required');
  }

  // 2. Prevent Self-Deletion
  if (session.user.id === userId) {
    throw new Error('Action prevented: Admins cannot delete their own account.');
  }

  // 3. Validate userId format
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error(`Invalid user ID format: ${userId}`);
  }

  let sessionDB; // Variable to hold the database session for transaction
  try {
    await connectDB();
    const UserModel = await getUserModel(); // Ensure UserModel is available
    const CardModel = await getCardModel(); // Ensure CardModel is available

    // Start a transaction
    sessionDB = await mongoose.startSession();
    sessionDB.startTransaction();

    // 4. Delete User Document
    const userDeletionResult = await UserModel.deleteOne({ _id: userId }, { session: sessionDB });

    if (userDeletionResult.deletedCount === 0) {
      await sessionDB.abortTransaction();
      sessionDB.endSession();
      throw new Error(`User not found with ID: ${userId}`);
    }

    // 5. Delete Associated Cards
    const cardDeletionResult = await CardModel.deleteMany({ user: userId }, { session: sessionDB });
    console.log(`Deleted ${cardDeletionResult.deletedCount} cards associated with user ${userId}.`);

    // Commit the transaction
    await sessionDB.commitTransaction();
    sessionDB.endSession();

    console.log(`Successfully deleted user ${userId} and associated cards.`);
    revalidatePath('/admin'); // Revalidate admin page cache
    return { success: true };

  } catch (error) {
    // Abort transaction on error
    if (sessionDB) {
      await sessionDB.abortTransaction();
      sessionDB.endSession();
    }
    console.error('Error deleting user permanently:', error);
    // Throw a more specific error or return a structured error response
    throw new Error(error instanceof Error ? error.message : 'Failed to permanently delete user.');
  }
}
