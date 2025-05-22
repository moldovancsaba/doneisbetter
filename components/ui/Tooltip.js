import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

export const Tooltip = ({
  children,
  content,
  position = "top",
  delay = 0,
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const timeoutRef = useRef(null);

  const updatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    let x = 0;
    let y = 0;

    switch (position) {
      case "top":
        x = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        y = triggerRect.top - tooltipRect.height - 8;
        break;
      case "bottom":
        x = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        y = triggerRect.bottom + 8;
        break;
      case "left":
        x = triggerRect.left - tooltipRect.width - 8;
        y = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        break;
      case "right":
        x = triggerRect.right + 8;
        y = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        break;
    }

    // Keep tooltip within viewport
    x = Math.max(8, Math.min(x, window.innerWidth - tooltipRect.width - 8));
    y = Math.max(8, Math.min(y, window.innerHeight - tooltipRect.height - 8));

    setCoords({ x, y });
  };

  useEffect(() => {
    if (isVisible) {
      updatePosition();
      window.addEventListener("scroll", updatePosition);
      window.addEventListener("resize", updatePosition);
    }

    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isVisible]);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
      >
        {children}
      </div>

      {createPortal(
        <AnimatePresence>
          {isVisible && (
            <motion.div
              ref={tooltipRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.1 }}
              style={{
                position: "fixed",
                left: coords.x,
                top: coords.y,
                zIndex: 9999,
              }}
              className={`
                px-2 py-1 rounded-lg text-sm font-medium
                bg-gray-900 dark:bg-gray-100
                text-white dark:text-gray-900
                shadow-lg pointer-events-none
                ${className}
              `}
            >
              {content}
              <div
                className={`
                  absolute w-2 h-2 
                  bg-gray-900 dark:bg-gray-100
                  transform rotate-45
                  ${position === "top" ? "bottom-[-4px]" : ""}
                  ${position === "bottom" ? "top-[-4px]" : ""}
                  ${position === "left" ? "right-[-4px]" : ""}
                  ${position === "right" ? "left-[-4px]" : ""}
                  ${position === "top" || position === "bottom" ? "left-1/2 -translate-x-1/2" : ""}
                  ${position === "left" || position === "right" ? "top-1/2 -translate-y-1/2" : ""}
                `}
              />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export const TooltipProvider = ({ children }) => {
  return (
    <div id="tooltip-root" className="relative z-50">
      {children}
    </div>
  );
};

// Helper hooks for tooltip positioning
export const useTooltipPosition = (triggerRef, tooltipRef, position) => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const updatePosition = () => {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      let x = 0;
      let y = 0;

      switch (position) {
        case "top":
          x = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
          y = triggerRect.top - tooltipRect.height - 8;
          break;
        case "bottom":
          x = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
          y = triggerRect.bottom + 8;
          break;
        case "left":
          x = triggerRect.left - tooltipRect.width - 8;
          y = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
          break;
        case "right":
          x = triggerRect.right + 8;
          y = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
          break;
      }

      setCoords({ x, y });
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [position]);

  return coords;
};
