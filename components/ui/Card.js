import React from "react";
import { motion } from "framer-motion";

export const Card = ({
  children,
  variant = "default",
  isInteractive = false,
  className = "",
  ...props
}) => {
  const variants = {
    default: "bg-white dark:bg-gray-800",
    glass: "backdrop-blur-lg bg-white/80 dark:bg-gray-800/80",
  };

  const Component = isInteractive ? motion.div : "div";
  const interactiveProps = isInteractive ? {
    whileHover: { scale: 1.02, translateY: -4 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2 }
  } : {};

  return (
    <Component
      className={`
        rounded-2xl
        border border-gray-200/50 dark:border-gray-700/50
        shadow-lg hover:shadow-xl
        transition-all duration-200
        ${variants[variant]}
        ${className}
      `}
      {...interactiveProps}
      {...props}
    >
      {children}
    </Component>
  );
};
