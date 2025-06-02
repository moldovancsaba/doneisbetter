import React, { createContext, useContext, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck, faExclamationCircle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

// Create context
const ToastContext = createContext({
  addToast: () => {},
  removeToast: () => {},
  clearToasts: () => {}
});

const TOAST_TIMEOUT = 5000; // Default 5 seconds

// Toast variations
const TOAST_TYPES = {
  success: {
    icon: faCheck,
    className: 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800'
  },
  error: {
    icon: faExclamationCircle,
    className: 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800'
  },
  info: {
    icon: faInfoCircle,
    className: 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800'
  },
  warning: {
    icon: faExclamationCircle,
    className: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800'
  }
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', timeout = TOAST_TIMEOUT) => {
    const id = Math.random().toString(36).substring(2, 15);
    const timestamp = new Date().toISOString(); // ISO 8601 with milliseconds

    setToasts(prev => [
      ...prev,
      { id, message, type, timestamp }
    ]);

    if (timeout !== 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
      }, timeout);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, clearToasts }}>
      {children}

      <div className="fixed bottom-0 right-0 p-4 space-y-4 z-50">
        <AnimatePresence mode="popLayout">
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 50, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              className={`flex items-start justify-between p-4 border rounded-lg shadow-lg max-w-sm pointer-events-auto backdrop-blur-lg ${TOAST_TYPES[toast.type].className}`}
            >
              <div className="flex items-start space-x-3">
                <FontAwesomeIcon 
                  icon={TOAST_TYPES[toast.type].icon} 
                  className="mt-1 w-5 h-5" 
                />
                <p className="text-sm">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

// Custom hook to use the toast context
export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
