'use client';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function UserProfile() {
  const { user } = useUser();

  if (!user) return null;

  return (
    <div className="flex items-center gap-4">
      {user.picture && (
        <img
          src={user.picture}
          alt={user.name || 'User'}
          className="w-8 h-8 rounded-full"
        />
      )}
      <div>
        <p className="font-medium">{user.name}</p>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>
    </div>
  );
}

