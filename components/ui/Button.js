import React from "react";
import { motion } from "framer-motion";

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  icon,
  className = "",
  ...props
}) => {
  const variants = {
    primary: `
      bg-primary-500 text-white 
      hover:bg-primary-600 active:bg-primary-700
      dark:hover:bg-primary-400 dark:active:bg-primary-300
      disabled:bg-primary-300 dark:disabled:bg-primary-700
    `,
    secondary: `
      bg-gray-200 text-gray-900
      dark:bg-gray-700 dark:text-white 
      hover:bg-gray-300 active:bg-gray-400
      dark:hover:bg-gray-600 dark:active:bg-gray-500
      disabled:bg-gray-100 dark:disabled:bg-gray-800
    `,
    outline: `
      border-2 border-primary-500 text-primary-500
      hover:bg-primary-50 active:bg-primary-100
      dark:hover:bg-primary-900/10 dark:active:bg-primary-900/20
      disabled:border-primary-300 disabled:text-primary-300
      dark:disabled:border-primary-700 dark:disabled:text-primary-700
    `,
  };

  // Ensure minimum touch target size of 44px
  const sizes = {
    sm: `
      min-h-[44px] min-w-[44px]
      px-4 py-2 text-sm
      md:min-h-[36px] md:min-w-[36px]
      md:px-3 md:py-1.5
    `,
    md: `
      min-h-[48px] min-w-[48px]
      px-5 py-2.5 text-base
      md:min-h-[44px] md:min-w-[44px]
      md:px-4 md:py-2
    `,
    lg: `
      min-h-[56px] min-w-[56px]
      px-6 py-3 text-lg
      md:min-h-[52px] md:min-w-[52px]
      md:px-5 md:py-2.5
    `,
    icon: `
      min-h-[48px] min-w-[48px]
      p-3 text-xl
      md:min-h-[44px] md:min-w-[44px]
      md:p-2
    `,
  };

  // Enhanced touch feedback for mobile
  const touchAnimation = {
    tap: { scale: 0.97 },
    hover: { scale: 1.02 },
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-xl font-medium relative
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
        disabled:cursor-not-allowed disabled:pointer-events-none
        touch-target
        ${variants[variant]}
        ${sizes[icon && !children ? 'icon' : size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={isLoading}
      {...props}
    >
      {icon && (
        <span className={`text-xl ${children ? 'mr-1' : ''}`}>
          {icon}
        </span>
      )}
      
      {isLoading ? (
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="relative w-5 h-5"
          >
            <div className="absolute inset-0 border-2 border-current border-t-transparent rounded-full opacity-25" />
            <div className="absolute inset-0 border-2 border-current border-t-transparent rounded-full opacity-75 animate-spin" />
          </motion.div>
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
};

// Prevent unnecessary re-renders
export default React.memo(Button);
