import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export const MobileNav = () => {
  const router = useRouter();

  const navItems = [
    {
      href: "/",
      label: "Home",
      icon: "🏠",
    },
    {
      href: "/swipe",
      label: "Swipe",
      icon: "🔄",
    },
    {
      href: "/admin",
      label: "Admin",
      icon: "⚙️",
    },
  ];

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden safe-bottom"
    >
      <div className="glass-card border-t border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-around px-2">
          {navItems.map((item) => (
            <Link href={item.href} key={item.href}>
              <motion.a
                whileTap={{ scale: 0.9 }}
                className={`
                  relative flex flex-col items-center justify-center
                  p-3 w-20 rounded-lg
                  ${router.pathname === item.href
                    ? "text-primary-500"
                    : "text-gray-600 dark:text-gray-400"
                  }
                `}
              >
                <span className="text-2xl mb-1">{item.icon}</span>
                <span className="text-xs font-medium">{item.label}</span>
                
                {/* Active Indicator */}
                {router.pathname === item.href && (
                  <motion.div
                    layoutId="mobile-nav-indicator"
                    className="absolute -bottom-2 w-1 h-1 rounded-full bg-primary-500"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.a>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Safe Area Spacer */}
      <div className="h-safe-bottom bg-white dark:bg-gray-900" />
    </motion.nav>
  );
};

// Bottom Tab Indicator Animation
const TabIndicator = ({ isActive }) => (
  <AnimatePresence>
    {isActive && (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        className="absolute -top-1 left-1/2 -translate-x-1/2
                   w-1 h-1 rounded-full bg-primary-500"
      />
    )}
  </AnimatePresence>
);

// Export both components
export { MobileNav, TabIndicator };
