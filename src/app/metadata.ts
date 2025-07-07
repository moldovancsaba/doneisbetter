import { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#1a1a1a'
};

export const metadata: Metadata = {
  manifest: '/manifest.json',
  title: 'DoneIsBetter',
  description: 'A better way to organize and rank your tasks',
};
