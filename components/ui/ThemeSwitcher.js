import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="
        p-2 rounded-lg
        bg-gray-100 dark:bg-gray-800
        text-gray-800 dark:text-gray-200
        hover:bg-gray-200 dark:hover:bg-gray-700
        transition-colors duration-200
      "
      aria-label="Toggle theme"
    >
      <motion.span
        initial={false}
        animate={{ rotate: theme === "dark" ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        className="block text-xl"
      >
        {theme === "dark" ? "🌞" : "🌙"}
      </motion.span>
    </motion.button>
  );
}
