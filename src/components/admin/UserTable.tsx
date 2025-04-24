'use client'

import { useState, useEffect } from 'react'
import { updateUserRole, getAllUsers } from '@/app/actions/admin'
import { toast } from 'react-hot-toast'
import type { Types } from 'mongoose'

interface User {
  _id: string
  name: string
  email: string
  role: 'user' | 'admin'
  createdAt: string
}

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getAllUsers()
        // Transform MongoDB documents to match User interface
        const transformedUsers = data.map(user => ({
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role as 'user' | 'admin',
          createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : user.createdAt
        }))
        setUsers(transformedUsers)
      } catch (error) {
        toast.error('Failed to load users')
        console.error('Error loading users:', error)
      } finally {
        setLoading(false)
      }
    }
    loadUsers()
  }, [])

  const handleRoleChange = async (userId: string, newRole: 'user' | 'admin') => {
    const originalUsers = [...users]
    try {
      setUsers(users.map(u => 
        u._id === userId ? { ...u, role: newRole } : u
      ))
      
      await updateUserRole(userId, newRole)
      toast.success('Role updated successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update role')
      setUsers(originalUsers)
    }
  }

  if (loading) {
    return <div className="text-center py-4">Loading users...</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Name</th>
            <th className="text-left p-2">Email</th>
            <th className="text-left p-2">Role</th>
            <th className="text-left p-2">Created</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-4">
                No users found
              </td>
            </tr>
          ) : (
            users.map(user => (
              <tr key={user._id} className="border-b hover:bg-gray-50">
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value as 'user' | 'admin')}
                    className="border rounded p-1"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="p-2">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
