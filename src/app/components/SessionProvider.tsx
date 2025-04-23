'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

/**
 * Wraps the application with NextAuth's SessionProvider
 * This needs to be a client component to use the SessionProvider hook.
 */
export default function AuthProvider({ children }: Props) {
  return <SessionProvider>{children}</SessionProvider>;
}

