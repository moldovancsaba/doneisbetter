'use server'

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import { revalidatePath } from 'next/cache';

export async function getAllUsers() {
  const session = await getServerSession(authOptions);
  
  if (session?.user?.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required');
  }

  await connectDB();
  return User.find()
    .select('_id name email role createdAt')
    .sort({ createdAt: -1 })
    .lean();
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
