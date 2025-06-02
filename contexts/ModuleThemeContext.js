import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// Create the context
const ModuleThemeContext = createContext();

// Define module colors and their properties
export const moduleThemes = {
  home: {
    name: "Home 🏠",
    color: "home",
    lightBg: "bg-home-50/30",
    darkBg: "dark:bg-gray-900",
    bgClass: "bg-home-50/30 dark:bg-gray-900",
    gradient: "from-home-500 to-home-700",
    activeClass: "bg-home-600 dark:bg-home-700 text-white",
    inactiveClass: "text-home-700 dark:text-home-300 hover:bg-home-50 dark:hover:bg-home-900/20",
    borderClass: "border-home-200 dark:border-home-800",
    textClass: "text-home-700 dark:text-home-200",
    buttonClass: "bg-home-600 hover:bg-home-700 text-white",
    iconClass: "text-home-500 dark:text-home-400",
  },
  rankings: {
    name: "Rankings 🏆",
    color: "rankings",
    lightBg: "bg-rankings-50/30",
    darkBg: "dark:bg-gray-900",
    bgClass: "bg-rankings-50/30 dark:bg-gray-900",
    gradient: "from-rankings-500 to-rankings-700",
    activeClass: "bg-rankings-600 dark:bg-rankings-700 text-white",
    inactiveClass: "text-rankings-700 dark:text-rankings-300 hover:bg-rankings-50 dark:hover:bg-rankings-900/20",
    borderClass: "border-rankings-200 dark:border-rankings-800",
    textClass: "text-rankings-700 dark:text-rankings-200",
    buttonClass: "bg-rankings-600 hover:bg-rankings-700 text-white",
    iconClass: "text-rankings-500 dark:text-rankings-400",
  },
  swipe: {
    name: "Swipe 🔄",
    color: "swipe",
    lightBg: "bg-swipe-50/30",
    darkBg: "dark:bg-gray-900",
    bgClass: "bg-swipe-50/30 dark:bg-gray-900",
    gradient: "from-swipe-500 to-swipe-700",
    activeClass: "bg-swipe-600 dark:bg-swipe-700 text-white",
    inactiveClass: "text-swipe-700 dark:text-swipe-300 hover:bg-swipe-50 dark:hover:bg-swipe-900/20",
    borderClass: "border-swipe-200 dark:border-swipe-800",
    textClass: "text-swipe-700 dark:text-swipe-200",
    buttonClass: "bg-swipe-600 hover:bg-swipe-700 text-white",
    iconClass: "text-swipe-500 dark:text-swipe-400",
  },
  vote: {
    name: "Vote 🗳️",
    color: "vote",
    lightBg: "bg-vote-50/30",
    darkBg: "dark:bg-gray-900",
    bgClass: "bg-vote-50/30 dark:bg-gray-900",
    gradient: "from-vote-500 to-vote-700",
    activeClass: "bg-vote-600 dark:bg-vote-700 text-white",
    inactiveClass: "text-vote-700 dark:text-vote-300 hover:bg-vote-50 dark:hover:bg-vote-900/20",
    borderClass: "border-vote-200 dark:border-vote-800",
    textClass: "text-vote-700 dark:text-vote-200",
    buttonClass: "bg-vote-600 hover:bg-vote-700 text-white",
    iconClass: "text-vote-500 dark:text-vote-400",
  },
  admin: {
    name: "Admin ⚙️",
    color: "admin",
    lightBg: "bg-admin-50/30",
    darkBg: "dark:bg-gray-900",
    bgClass: "bg-admin-50/30 dark:bg-gray-900",
    gradient: "from-admin-500 to-admin-700",
    activeClass: "bg-admin-600 dark:bg-admin-700 text-white",
    inactiveClass: "text-admin-700 dark:text-admin-300 hover:bg-admin-50 dark:hover:bg-admin-900/20",
    borderClass: "border-admin-200 dark:border-admin-800",
    textClass: "text-admin-700 dark:text-admin-200",
    buttonClass: "bg-admin-600 hover:bg-admin-700 text-white",
    iconClass: "text-admin-500 dark:text-admin-400",
  },
  users: {
    name: "Users 👥",
    color: "primary", // Using primary color scheme instead of admin
    lightBg: "bg-primary-50/30",
    darkBg: "dark:bg-gray-900",
    bgClass: "bg-primary-50/30 dark:bg-gray-900",
    gradient: "from-primary-500 to-primary-700",
    activeClass: "bg-primary-600 dark:bg-primary-700 text-white",
    inactiveClass: "text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20",
    borderClass: "border-primary-200 dark:border-primary-800",
    textClass: "text-primary-700 dark:text-primary-200",
    buttonClass: "bg-primary-600 hover:bg-primary-700 text-white",
    iconClass: "text-primary-500 dark:text-primary-400",
  },
};

// Provider component
export const ModuleThemeProvider = ({ children }) => {
  const router = useRouter();
  const [currentModule, setCurrentModule] = useState('home');
  
  // Update the module theme based on the current route
  useEffect(() => {
    const path = router.pathname;
    
    if (path === '/') {
      setCurrentModule('home');
    } else if (path.startsWith('/rankings')) {
      setCurrentModule('rankings');
    } else if (path.startsWith('/swipe')) {
      setCurrentModule('swipe');
    } else if (path.startsWith('/vote')) {
      setCurrentModule('vote');
    } else if (path.startsWith('/users')) {
      setCurrentModule('users');
    } else if (path.startsWith('/admin')) {
      setCurrentModule('admin');
    } else {
      setCurrentModule('home'); // Default
    }
  }, [router.pathname]);
  
  // Get the current module theme object
  const theme = moduleThemes[currentModule] || moduleThemes.home;
  
  // Construct the background class
  const backgroundClass = `${theme.lightBg} ${theme.darkBg}`;
  
  return (
    <ModuleThemeContext.Provider value={{ 
      currentModule, 
      theme, 
      bgClass: theme.bgClass,
      allThemes: moduleThemes
    }}>
      {children}
    </ModuleThemeContext.Provider>
  );
};

// Custom hook to use the module theme context
export const useModuleTheme = () => {
  const context = useContext(ModuleThemeContext);
  if (context === undefined) {
    throw new Error('useModuleTheme must be used within a ModuleThemeProvider');
  }
  return context;
};

