'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path ? 'bg-blue-700' : '';
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg relative z-50">
      <div className="w-full px-4">
        <div className="flex justify-between items-center h-16">
          {/* Desktop menu */}
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
            <button 
              className="p-2 rounded-md hover:bg-blue-700 touch-action-manipulation"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
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

        {/* Mobile menu dropdown */}
        <div 
          className={`${
            isMenuOpen ? 'block' : 'hidden'
          } md:hidden absolute left-0 right-0 bg-blue-600 shadow-lg`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/play"
              className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 ${isActive('/play')}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Play
            </Link>
            <Link
              href="/ranking"
              className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 ${isActive('/ranking')}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Rankings
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
