import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Input = ({
  label,
  error,
  helper,
  type = "text",
  size = "md",
  className = "",
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // Size variations with proper touch targets
  const sizes = {
    sm: "text-sm min-h-[36px] px-3",
    md: "text-base min-h-[44px] px-4",
    lg: "text-lg min-h-[52px] px-5",
  };

  return (
    <div className="space-y-2 sm:space-y-3">
      {label && (
        <motion.label
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
            block font-medium
            text-gray-700 dark:text-gray-300
            ${size === 'lg' ? 'text-base' : 'text-sm'}
          `}
        >
          {label}
        </motion.label>
      )}
      <div className="relative">
        <input
          type={type}
          className={`
            w-full
            ${sizes[size]}
            py-2
            rounded-xl
            bg-white dark:bg-gray-800
            border-2 border-gray-300 dark:border-gray-600
            text-gray-900 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-500
            transition-all duration-200
            focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500
            disabled:opacity-50 disabled:cursor-not-allowed
            touch-target
            ${error ? "border-red-500 focus:ring-red-500/50 focus:border-red-500" : ""}
            ${className}
          `}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        <AnimatePresence>
          {isFocused && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 -z-10 rounded-lg bg-primary-500/5"
            />
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {(error || helper) && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`
              ${size === 'sm' ? 'text-xs' : 'text-sm'}
              ${error 
                ? "text-red-500 dark:text-red-400" 
                : "text-gray-500 dark:text-gray-400"
              }
              mt-1.5
            `}
          >
            {error || helper}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export const TextArea = ({
  label,
  error,
  helper,
  size = "md",
  className = "",
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // Size variations with proper touch targets
  const sizes = {
    sm: "text-sm min-h-[80px] px-3",
    md: "text-base min-h-[100px] px-4",
    lg: "text-lg min-h-[120px] px-5",
  };

  return (
    <div className="space-y-2 sm:space-y-3">
      {label && (
        <motion.label
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
            block font-medium
            text-gray-700 dark:text-gray-300
            ${size === 'lg' ? 'text-base' : 'text-sm'}
          `}
        >
          {label}
        </motion.label>
      )}
      <div className="relative">
        <textarea
          className={`
            w-full
            ${sizes[size]}
            py-3
            rounded-xl
            bg-white dark:bg-gray-800
            border-2 border-gray-300 dark:border-gray-600
            text-gray-900 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-500
            transition-all duration-200
            focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500
            disabled:opacity-50 disabled:cursor-not-allowed
            touch-target
            resize-y
            ${error ? "border-red-500 focus:ring-red-500/50 focus:border-red-500" : ""}
            ${className}
          `}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        <AnimatePresence>
          {isFocused && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 -z-10 rounded-lg bg-primary-500/5"
            />
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {(error || helper) && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`text-sm ${
              error ? "text-red-500" : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {error || helper}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Select = ({
  label,
  error,
  helper,
  options = [],
  size = "md",
  className = "",
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // Size variations with proper touch targets
  const sizes = {
    sm: "text-sm min-h-[36px] px-3",
    md: "text-base min-h-[44px] px-4",
    lg: "text-lg min-h-[52px] px-5",
  };

  return (
    <div className="space-y-2 sm:space-y-3">
      {label && (
        <motion.label
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
            block font-medium
            text-gray-700 dark:text-gray-300
            ${size === 'lg' ? 'text-base' : 'text-sm'}
          `}
        >
          {label}
        </motion.label>
      )}
      <div className="relative">
        <select
          className={`
            w-full
            ${sizes[size]}
            py-2
            rounded-xl
            bg-white dark:bg-gray-800
            border-2 border-gray-300 dark:border-gray-600
            text-gray-900 dark:text-gray-100
            transition-all duration-200
            focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500
            disabled:opacity-50 disabled:cursor-not-allowed
            touch-target
            appearance-none
            bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 20 20%22%3E%3Cpath stroke=%22%236B7280%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%221.5%22 d=%22m6 8 4 4 4-4%22/%3E%3C/svg%3E')] 
            bg-[position:right_0.5rem_center]
            bg-[length:1.5em_1.5em]
            bg-no-repeat
            pr-10
            ${error ? "border-red-500 focus:ring-red-500/50 focus:border-red-500" : ""}
            ${className}
          `}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <AnimatePresence>
          {isFocused && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 -z-10 rounded-lg bg-primary-500/5"
            />
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {(error || helper) && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`text-sm ${
              error ? "text-red-500" : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {error || helper}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};
