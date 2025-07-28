"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Swipe', href: '/swipe' },
    { name: 'Rankings', href: '/rankings' },
    { name: 'Card Management', href: '/admin/cards' },
  ];

  return (
    <nav className="p-4 bg-gray-800">
      <div className="container flex items-center justify-between mx-auto">
        <div className="flex space-x-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.name} href={link.href} className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}>
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
