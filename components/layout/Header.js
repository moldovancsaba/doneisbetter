import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/router";

export const Header = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const navigationItems = [
    { href: "/", label: "Home" },
    { href: "/swipe", label: "Swipe" },
    { href: "/vote", label: "Vote" },
    { href: "/admin", label: "Admin" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-700/50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center cursor-pointer"
              >
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-600">
                  DoneisBetter
                </span>
              </motion.div>
            </Link>

            <div className="hidden md:flex items-center gap-2">
              {navigationItems.map((item) => (
                <motion.div
                  key={item.href}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    href={item.href}
                    className={`
                      px-4 py-2 rounded-lg font-medium transition-colors
                      ${router.pathname === item.href
                        ? "bg-primary-500 text-white"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }
                    `}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              {mounted && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="ml-4 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                >
                  {theme === "dark" ? "🌞" : "🌙"}
                </motion.button>
              )}
            </div>
          </div>
        </nav>
      </div>
    </motion.header>
  );
};

export const PageWrapper = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="pt-20 pb-24 md:pb-8"
      >
        {children}
      </motion.main>
    </div>
  );
};
