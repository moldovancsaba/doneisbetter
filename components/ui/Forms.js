import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Input = ({
  label,
  error,
  helper,
  type = "text",
  className = "",
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          className={`
            w-full px-4 py-2 rounded-lg
            bg-white dark:bg-gray-800
            border border-gray-300 dark:border-gray-600
            text-gray-900 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-500
            transition-colors duration-200
            focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500
            disabled:opacity-50 disabled:cursor-not-allowed
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

export const TextArea = ({
  label,
  error,
  helper,
  className = "",
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        <textarea
          className={`
            w-full px-4 py-2 rounded-lg
            bg-white dark:bg-gray-800
            border border-gray-300 dark:border-gray-600
            text-gray-900 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-500
            transition-colors duration-200
            focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500
            disabled:opacity-50 disabled:cursor-not-allowed
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
  className = "",
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={`
            w-full px-4 py-2 rounded-lg
            bg-white dark:bg-gray-800
            border border-gray-300 dark:border-gray-600
            text-gray-900 dark:text-gray-100
            transition-colors duration-200
            focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500
            disabled:opacity-50 disabled:cursor-not-allowed
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
