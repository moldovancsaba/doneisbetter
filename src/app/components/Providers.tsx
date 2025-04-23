'use client';

import { Toaster } from 'react-hot-toast';

/**
 * Client component wrapper for client-side only features
 * Contains toast notifications and other client-side providers
 */
export default function Providers() {
  return <Toaster position="bottom-right" />;
}

