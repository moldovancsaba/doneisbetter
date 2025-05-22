import { motion, AnimatePresence } from "framer-motion";

export const LoadingSpinner = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16"
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className={`
          ${sizes[size]}
          border-4 rounded-full
          border-primary-200 dark:border-primary-900
          border-t-primary-500
        `}
      />
    </div>
  );
};

export const LoadingOverlay = ({ message = "Loading..." }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/50 dark:bg-gray-900/50"
  >
    <div className="text-center space-y-4">
      <LoadingSpinner size="lg" />
      <p className="text-gray-600 dark:text-gray-300">{message}</p>
    </div>
  </motion.div>
);

export const LoadingCard = () => (
  <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-lg space-y-4">
    <motion.div
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className="space-y-3"
    >
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-5/6" />
    </motion.div>
  </div>
);

export const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

export const FadeIn = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3, delay }}
  >
    {children}
  </motion.div>
);

export const SlideIn = ({ children, direction = "up", delay = 0 }) => {
  const directions = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      {children}
    </motion.div>
  );
};

export const ErrorState = ({ message, onRetry }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="rounded-2xl bg-red-50 dark:bg-red-900/20 p-6 text-center"
  >
    <div className="text-red-500 text-4xl mb-4">⚠️</div>
    <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">
      Something went wrong
    </h3>
    <p className="text-red-600 dark:text-red-300 mb-4">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors"
      >
        Try Again
      </button>
    )}
  </motion.div>
);

export const EmptyState = ({ message, action }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="rounded-2xl bg-gray-50 dark:bg-gray-800/50 p-8 text-center"
  >
    <div className="text-4xl mb-4">📭</div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
      Nothing here yet
    </h3>
    <p className="text-gray-600 dark:text-gray-300 mb-4">{message}</p>
    {action}
  </motion.div>
);
