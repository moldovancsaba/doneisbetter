import { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { headers } from 'next/headers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#1a1a1a'
}

export const metadata: Metadata = {
  manifest: '/manifest.json',
  title: 'DoneIsBetter',
  description: 'A better way to organize and rank your tasks',
};

function isPlayRoute(pathname: string) {
  return pathname.startsWith('/play');
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} font-sans antialiased h-full bg-gray-50 dark:bg-gray-900 flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
