import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Dropdown = ({
  trigger,
  items,
  align = "right",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const alignmentStyles = {
    left: "left-0",
    right: "right-0",
    center: "left-1/2 -translate-x-1/2",
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger */}
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className={`
              absolute z-50 mt-2 ${alignmentStyles[align]}
              min-w-[200px] overflow-hidden
              rounded-xl shadow-lg
              bg-white dark:bg-gray-800
              border border-gray-200 dark:border-gray-700
              ${className}
            `}
          >
            <div className="py-1">
              {items.map((item, index) => (
                <div key={index}>
                  {item.divider ? (
                    <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
                  ) : (
                    <motion.div
                      whileHover={{ x: 4 }}
                      transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    >
                      {item.href ? (
                        <a
                          href={item.href}
                          className={`
                            block px-4 py-2 text-sm
                            ${item.disabled
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"}
                            ${item.danger
                              ? "text-red-600 dark:text-red-400"
                              : "text-gray-700 dark:text-gray-300"}
                          `}
                          onClick={(e) => {
                            if (item.disabled) e.preventDefault();
                            if (!item.disabled && item.onClick) {
                              item.onClick();
                              setIsOpen(false);
                            }
                          }}
                        >
                          <div className="flex items-center gap-2">
                            {item.icon && <span>{item.icon}</span>}
                            <span>{item.label}</span>
                          </div>
                        </a>
                      ) : (
                        <button
                          className={`
                            block w-full text-left px-4 py-2 text-sm
                            ${item.disabled
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"}
                            ${item.danger
                              ? "text-red-600 dark:text-red-400"
                              : "text-gray-700 dark:text-gray-300"}
                          `}
                          onClick={() => {
                            if (!item.disabled && item.onClick) {
                              item.onClick();
                              setIsOpen(false);
                            }
                          }}
                          disabled={item.disabled}
                        >
                          <div className="flex items-center gap-2">
                            {item.icon && <span>{item.icon}</span>}
                            <span>{item.label}</span>
                          </div>
                        </button>
                      )}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const DropdownButton = ({
  label,
  items,
  variant = "primary",
  size = "md",
  align = "right",
  className = "",
}) => {
  const variants = {
    primary: "bg-primary-500 text-white hover:bg-primary-600",
    secondary: "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600",
    outline: "border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <Dropdown
      align={align}
      trigger={
        <button
          className={`
            inline-flex items-center justify-center
            rounded-lg font-medium transition-colors
            ${variants[variant]}
            ${sizes[size]}
            ${className}
          `}
        >
          {label}
          <svg
            className="w-4 h-4 ml-2 -mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      }
      items={items}
    />
  );
};
