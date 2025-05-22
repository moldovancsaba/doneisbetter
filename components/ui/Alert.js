import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export const Alert = ({
  type = "info",
  title,
  message,
  action,
  onClose,
  autoClose = false,
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  const types = {
    info: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-200 dark:border-blue-800",
      text: "text-blue-800 dark:text-blue-200",
      icon: "ℹ️",
    },
    success: {
      bg: "bg-green-50 dark:bg-green-900/20",
      border: "border-green-200 dark:border-green-800",
      text: "text-green-800 dark:text-green-200",
      icon: "✅",
    },
    warning: {
      bg: "bg-yellow-50 dark:bg-yellow-900/20",
      border: "border-yellow-200 dark:border-yellow-800",
      text: "text-yellow-800 dark:text-yellow-200",
      icon: "⚠️",
    },
    error: {
      bg: "bg-red-50 dark:bg-red-900/20",
      border: "border-red-200 dark:border-red-800",
      text: "text-red-800 dark:text-red-200",
      icon: "❌",
    },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`
            rounded-xl border p-4
            ${types[type].bg}
            ${types[type].border}
            ${className}
          `}
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-xl">{types[type].icon}</span>
            </div>
            <div className="ml-3 flex-1">
              <div className="flex items-center justify-between">
                <h3 className={`text-sm font-medium ${types[type].text}`}>
                  {title}
                </h3>
                {onClose && (
                  <button
                    type="button"
                    className={`
                      inline-flex rounded-md p-1.5
                      ${types[type].text}
                      hover:bg-white dark:hover:bg-gray-800
                      focus:outline-none focus:ring-2 focus:ring-offset-2
                      focus:ring-offset-${type}-50 focus:ring-${type}-600
                    `}
                    onClick={() => {
                      setIsVisible(false);
                      onClose();
                    }}
                  >
                    <span className="sr-only">Dismiss</span>
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>
              {message && (
                <div className={`mt-2 text-sm ${types[type].text}`}>
                  {message}
                </div>
              )}
              {action && (
                <div className="mt-4">
                  <div className="-mx-2 -my-1.5 flex">
                    {action}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const AlertAction = ({ children, onClick, className = "" }) => (
  <button
    type="button"
    className={`
      rounded-md px-2 py-1.5 text-sm font-medium
      focus:outline-none focus:ring-2 focus:ring-offset-2
      ${className}
    `}
    onClick={onClick}
  >
    {children}
  </button>
);

export const useAlert = () => {
  const [alerts, setAlerts] = useState([]);

  const addAlert = (alert) => {
    const id = Math.random().toString(36).substr(2, 9);
    setAlerts((prev) => [...prev, { ...alert, id }]);

    if (alert.autoClose) {
      setTimeout(() => {
        removeAlert(id);
      }, 5000);
    }

    return id;
  };

  const removeAlert = (id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  const AlertContainer = () => (
    <div className="fixed bottom-0 right-0 p-4 space-y-4 z-50">
      <AnimatePresence>
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            {...alert}
            onClose={() => removeAlert(alert.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );

  return { addAlert, removeAlert, AlertContainer };
};
