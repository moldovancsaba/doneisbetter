import React from 'react';
import { motion } from 'framer-motion';
import ErrorBoundary from '../ui/ErrorBoundary';
import ErrorDisplay from '../ui/ErrorDisplay';
import { logError } from '../../utils/error';
import { useModuleTheme } from '../../contexts/ModuleThemeContext';
import { Header } from './Header';
import { toISOWithMillisec } from '../../utils/dates';

const RetryButton = ({ onRetry }) => (
  <button
    onClick={onRetry}
    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
  >
    Try Again
  </button>
);

const PageContent = ({ children }) => {
  const { theme } = useModuleTheme();

  return (
    <>
      <Header />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={`min-h-screen p-4 sm:p-6 lg:p-8 ${theme.bgClass}`}
      >
        {children}
      </motion.div>
    </>
  );
};

export const PageWrapper = ({ children }) => {
  const handleError = (error, errorInfo) => {
    const timestamp = new Date().toISOString();
    logError(error, 'PageWrapper', errorInfo, timestamp);
  };

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <ErrorBoundary
      onError={handleError}
      fallback={({ error }) => (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <ErrorDisplay error={error} />
            <RetryButton onRetry={handleRetry} />
          </div>
        </div>
      )}
    >
      <PageContent>{children}</PageContent>
    </ErrorBoundary>
  );
};

export default PageWrapper;
