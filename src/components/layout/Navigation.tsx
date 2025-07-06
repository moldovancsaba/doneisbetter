'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'bg-blue-700' : '';
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="w-full px-4">
        <div className="flex justify-between items-center h-16">

          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/play"
              className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive('/play')}`}
            >
              Play
            </Link>
            <Link
              href="/ranking"
              className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive('/ranking')}`}
            >
              Rankings
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="p-2 rounded-md hover:bg-blue-700">
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
