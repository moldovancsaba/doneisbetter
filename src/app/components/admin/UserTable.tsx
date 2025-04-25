// src/app/components/admin/UserTable.tsx
'use client'

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getAllUsers, updateUserRole, deleteUserPermanently } from '@/app/actions/admin';
import { useSession } from 'next-auth/react';
import { Types } from 'mongoose'; // Import Types for ObjectId if needed, though we use string

// Define the User interface matching the data structure returned and transformed
interface User {
  _id: string; // Using string ID after transformation
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string; // Using formatted date string
}

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession(); // Get current session for self-delete check

  // Effect to load users on component mount or when session changes
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true); // Start loading
      try {
        const data = await getAllUsers(session); // Pass session to server action
        // Transform data for display
        const transformedData = data.map(user => ({
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role as 'user' | 'admin',
          createdAt: new Date(user.createdAt).toLocaleDateString() // Format date
        }));
        setUsers(transformedData);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to load users');
        console.error('Error loading users:', error);
      } finally {
        setLoading(false); // End loading
      }
    };
    
    // Only load users if session exists (authenticated)
    if (session) {
      loadUsers();
    }
  }, [session]); // Re-run when session changes

  // Handler for changing a user's role
  const handleRoleChange = async (userId: string, newRole: 'user' | 'admin') => {
    const originalUsers = JSON.parse(JSON.stringify(users)); // Deep copy for revert
    try {
      // Optimistic UI update
      setUsers(users.map(u =>
        u._id === userId ? { ...u, role: newRole } : u
      ));

      await updateUserRole(userId, newRole); // Call server action
      toast.success('User role updated successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update role');
      setUsers(originalUsers); // Revert UI on error
    }
  };

  // Handler for permanently deleting a user
  const handleDeleteUser = async (userId: string, userName: string) => {
    // Prevent deleting self (client-side check)
    if (session?.user?.id === userId) {
      toast.error("You cannot delete your own account.");
      return;
    }

    // Confirmation dialog
    if (!window.confirm(`Are you sure you want to permanently delete user "${userName}" and all their associated data? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteUserPermanently(userId); // Call server action
      setUsers(prevUsers => prevUsers.filter(u => u._id !== userId)); // Remove from UI
      toast.success(`User "${userName}" permanently deleted.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete user.');
    }
  };

  // Render loading state
  if (loading) return <div className="text-center py-4 text-gray-500">Loading users...</div>;

  // Render the user table
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px]"> {/* Added min-width */}
        <thead>
          <tr className="border-b">
            <th className="text-left p-2 font-medium">Name</th>
            <th className="text-left p-2 font-medium">Email</th>
            <th className="text-left p-2 font-medium">Role</th>
            <th className="text-left p-2 font-medium">Joined</th>
            <th className="text-left p-2 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr><td colSpan={5} className="text-center py-4 text-gray-500">No users found.</td></tr>
          ) : (
            users.map(user => (
              <tr key={user._id} className="border-b hover:bg-gray-50">
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value as 'user' | 'admin')}
                    className="border rounded p-1 text-sm"
                    // Disable role change for the current user
                    disabled={session?.user?.id === user._id}
                    title={session?.user?.id === user._id ? "Cannot change your own role" : "Change user role"}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="p-2">{user.createdAt}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleDeleteUser(user._id, user.name)}
                    disabled={session?.user?.id === user._id} // Disable self-delete
                    className={`px-2 py-1 text-xs text-white bg-red-600 rounded hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed`}
                    title={session?.user?.id === user._id ? "Cannot delete yourself" : "Delete user"}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
