import { createContext, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ToastContext = createContext({
  addToast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "info", duration = 3000) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-0 right-0 p-4 z-50 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              className="mb-2 pointer-events-auto"
            >
              <div
                className={`
                  rounded-lg shadow-lg px-6 py-4 
                  backdrop-blur-lg
                  flex items-center gap-3
                  ${toast.type === "success" && "bg-green-500/90 text-white"}
                  ${toast.type === "error" && "bg-red-500/90 text-white"}
                  ${toast.type === "info" && "bg-primary-500/90 text-white"}
                  ${toast.type === "warning" && "bg-yellow-500/90 text-white"}
                `}
              >
                <span className="text-xl">
                  {toast.type === "success" && "✅"}
                  {toast.type === "error" && "❌"}
                  {toast.type === "info" && "ℹ️"}
                  {toast.type === "warning" && "⚠️"}
                </span>
                <p className="font-medium">{toast.message}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
