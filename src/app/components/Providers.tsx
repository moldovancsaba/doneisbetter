'use client';

import React from 'react';
import { Toaster } from 'react-hot-toast';

// Ensure it accepts children prop
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children} {/* Render children */}
      <Toaster position="bottom-right" />
    </>
  );
}
