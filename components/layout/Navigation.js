import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

export const Navigation = () => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/swipe", label: "Swipe", icon: "🔄" },
    { href: "/vote", label: "Vote", icon: "🗳️" },
    { href: "/admin", label: "Admin", icon: "⚙️" },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 hidden md:block"
      >
        <div className="glass-card border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/">
                <span className="text-xl font-bold text-gradient cursor-pointer">
                  DoneisBetter
                </span>
              </Link>

              <div className="flex items-center gap-6">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      px-4 py-2 rounded-lg font-medium transition-colors duration-200
                      ${router.pathname === item.href
                        ? "bg-primary-500 text-white"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }
                    `}
                  >
                    {item.label}
                  </Link>
                ))}
                
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {theme === "dark" ? "🌞" : "🌙"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      >
        <div className="glass-card border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-around h-16">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex flex-col items-center justify-center w-20 py-2
                  text-sm font-medium transition-colors duration-200 rounded-lg
                  ${router.pathname === item.href
                    ? "text-primary-500"
                    : "text-gray-600 dark:text-gray-300"
                  }
                `}
              >
                <span className="text-xl mb-1">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </motion.nav>
    </>
  );
};
