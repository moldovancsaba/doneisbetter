import { motion } from "framer-motion";

export const LoadingSpinner = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16"
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className={`
          ${sizes[size]}
          border-4 rounded-full
          border-primary-200 dark:border-primary-900
          border-t-primary-500
        `}
      />
    </div>
  );
};

export const LoadingScreen = ({ message = "Loading..." }) => (
  <div className="min-h-[80vh] flex items-center justify-center">
    <div className="text-center space-y-4">
      <LoadingSpinner size="lg" />
      <p className="text-gray-600 dark:text-gray-300">
        {message}
      </p>
    </div>
  </div>
);

export const LoadingOverlay = ({ message = "Loading..." }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/50 dark:bg-gray-900/50">
    <div className="text-center space-y-4">
      <LoadingSpinner size="lg" />
      <p className="text-gray-600 dark:text-gray-300">
        {message}
      </p>
    </div>
  </div>
);

export const LoadingButton = ({ children, loading, ...props }) => (
  <button
    disabled={loading}
    className="relative inline-flex items-center justify-center"
    {...props}
  >
    {loading ? (
      <>
        <LoadingSpinner size="sm" className="mr-2" />
        Loading...
      </>
    ) : (
      children
    )}
  </button>
);
