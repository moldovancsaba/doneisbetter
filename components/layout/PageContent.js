import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ContentSkeleton } from '../ui/Loading';
import { useModuleTheme } from '../../contexts/ModuleThemeContext';

// Consistent page layout component that handles loading states
export const PageContent = ({
  title,
  subtitle,
  loading = false,
  refreshing = false,
  error = null,
  actions = null,
  stats = null,
  children,
  module = 'primary'
}) => {
  const { theme: moduleTheme } = useModuleTheme();
  const [showContent, setShowContent] = useState(false);

  // Add a slight delay before showing content to prevent flickering
  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className={`text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-${module}-500 to-${module}-700`}>
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex space-x-3">
            {actions}
          </div>
        )}
      </motion.div>

      {/* Stats Grid */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {loading && !refreshing ? (
            [...Array(3)].map((_, i) => (
              <ContentSkeleton key={i} type="card" />
            ))
          ) : (
            stats
          )}
        </motion.div>
      )}

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
        transition={{ delay: 0.2 }}
      >
        {loading && !refreshing ? (
          <ContentSkeleton type="table" />
        ) : error ? (
          <div className="text-center py-8">
            <div className="flex flex-col items-center justify-center">
              <span className="text-3xl mb-4">⚠️</span>
              <p className="text-red-500 dark:text-red-400 mb-2">{error}</p>
            </div>
          </div>
        ) : (
          children
        )}
      </motion.div>
    </div>
  );
};

