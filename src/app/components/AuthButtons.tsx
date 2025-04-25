'use client'; // MUST be the very first line

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link'; // Import Link

/**
 * Displays Login/Logout buttons based on session status
 */
export default function AuthButtons() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="text-sm text-gray-500 animate-pulse">Loading...</div>;
  }

  if (session) {
    // User is signed in, show user info and sign out button
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
        {/* Conditionally display Admin link */}
        {session.user?.role === 'admin' && (
          <Link href="/admin" className="px-3 py-1 text-sm text-white bg-indigo-600 rounded hover:bg-indigo-700 transition-colors">
            Admin
          </Link>
        )}
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

  // User is not signed in, show sign in buttons
  return (
    <div className="flex gap-4">
      <button
        onClick={() => signIn('google')}
        className="px-4 py-2 bg-white text-gray-800 rounded-md border border-gray-300 hover:bg-gray-50 flex items-center gap-2"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Sign in with Google
      </button>

      {/* Only show Admin Login button in non-production environments */}
      {process.env.NODE_ENV !== 'production' && (
        <button
          onClick={() => signIn('admin-login', { callbackUrl: '/' })}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          Admin Login (Dev)
        </button>
      )}
    </div>
  );
}

