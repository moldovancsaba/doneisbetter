'use client';

import React from 'react';
import { Toaster } from 'react-hot-toast';

// Removed SessionProvider and related imports

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children} {/* Render children directly */}
      <Toaster position="bottom-right" />
    </>
  );
}
