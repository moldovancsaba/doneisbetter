'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

/**
 * Displays Login/Logout buttons based on session status
 */
export default function AuthButtons() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="text-sm text-gray-500 animate-pulse">Loading...</div>;
  }

  if (session) {
    return (
      <div className="flex items-center space-x-3">
        {session.user?.image && (
          <img 
            src={session.user.image} 
            alt={session.user.name || 'User'}
            className="w-8 h-8 rounded-full border border-gray-300" 
          />
        )}
        <span className="text-sm text-gray-700 hidden md:inline font-medium">
          {session.user?.name || session.user?.email}
        </span>
        <button 
          onClick={() => signOut()}
          className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
          aria-label="Sign out"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={() => signIn('google')}
      className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
      aria-label="Sign in with Google"
    >
      Sign In with Google
    </button>
  );
}

