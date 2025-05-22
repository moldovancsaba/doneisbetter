import React from "react";
import { motion } from "framer-motion";

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  ...props
}) => {
  const variants = {
    primary: "bg-primary-500 hover:bg-primary-600 text-white",
    secondary: "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white",
    outline: "border-2 border-primary-500 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        inline-flex items-center justify-center
        rounded-lg font-medium
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
        disabled:opacity-60 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </motion.button>
  );
};
