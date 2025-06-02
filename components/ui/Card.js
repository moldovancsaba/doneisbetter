import React from "react";
import { motion, useReducedMotion } from "framer-motion";

export const Card = ({
  children,
  variant = "default",
  isInteractive = false,
  padding = "default",
  elevation = "md",
  noBorder = false,
  className = "",
  ...props
}) => {
  // Detect if user prefers reduced motion
  const shouldReduceMotion = useReducedMotion();

  const variants = {
    default: "bg-white dark:bg-gray-800",
    glass: `
      backdrop-blur-lg 
      bg-white/80 dark:bg-gray-800/80
      supports-[backdrop-filter]:bg-white/60 
      supports-[backdrop-filter]:dark:bg-gray-800/60
    `,
    transparent: "bg-transparent",
  };

  const paddings = {
    none: "",
    compact: "p-2 sm:p-3",
    default: "p-3 sm:p-4 md:p-5",
    large: "p-4 sm:p-6 md:p-8",
  };

  const elevations = {
    none: "",
    sm: "shadow-sm hover:shadow",
    md: "shadow-md hover:shadow-lg",
    lg: "shadow-lg hover:shadow-xl transition-shadow",
  };

  const motionProps = isInteractive ? {
    whileHover: shouldReduceMotion ? {} : { 
      scale: 1.02, 
      translateY: -4 
    },
    whileTap: shouldReduceMotion ? {} : { 
      scale: 0.98 
    },
    transition: { 
      duration: 0.2,
      ease: "easeInOut"
    }
  } : {};

  const Component = isInteractive ? motion.div : "div";

  return (
    <Component
      className={`
        overflow-hidden
        rounded-xl sm:rounded-2xl
        ${!noBorder && 'border border-gray-200/50 dark:border-gray-700/50'}
        ${elevations[elevation]}
        transition-all duration-200
        touch-target
        ${variants[variant]}
        ${paddings[padding]}
        ${className}
      `}
      {...motionProps}
      {...props}
    >
      <div className="relative h-full">
        {children}
      </div>

      {/* Touch feedback overlay for mobile */}
      {isInteractive && (
        <motion.div
          initial={{ opacity: 0 }}
          whileTap={{ opacity: 0.05 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-current pointer-events-none"
        />
      )}
    </Component>
  );
};

// Prevent unnecessary re-renders
export default React.memo(Card);
