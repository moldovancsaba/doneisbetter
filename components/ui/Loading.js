import { motion } from "framer-motion";
import { useModuleTheme } from "../../contexts/ModuleThemeContext";

// Content Skeleton component for displaying loading UI
export const ContentSkeleton = ({ type = 'default' }) => {
  const { theme: moduleTheme } = useModuleTheme();

  const renderDefaultSkeleton = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
      </div>
    </div>
  );

  const renderCardSkeleton = () => (
    <div className={`p-4 border ${moduleTheme.borderClass} rounded-lg animate-pulse`}>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
      </div>
    </div>
  );

  const renderTableSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
      ))}
    </div>
  );

  switch (type) {
    case 'card':
      return renderCardSkeleton();
    case 'table':
      return renderTableSkeleton();
    default:
      return renderDefaultSkeleton();
  }
};

// Skeleton loading component with module theming
export const ModuleSkeleton = ({ type = "text", lines = 3, module, className = "" }) => {
  const { theme: moduleTheme } = useModuleTheme();
  const activeTheme = module ? `${module}` : moduleTheme.color;
  
  if (type === "card") {
    return (
      <div 
        className={`rounded-lg p-4 bg-gray-100 dark:bg-gray-800 animate-pulse border border-${activeTheme}-200/30 dark:border-${activeTheme}-700/30 ${className}`}
      >
        <div className={`h-4 bg-${activeTheme}-200/50 dark:bg-${activeTheme}-700/50 rounded w-3/4 mb-2`}></div>
        <div className={`h-4 bg-${activeTheme}-200/30 dark:bg-${activeTheme}-700/30 rounded w-full mb-2`}></div>
        <div className={`h-4 bg-${activeTheme}-200/20 dark:bg-${activeTheme}-700/20 rounded w-5/6`}></div>
      </div>
    );
  }
  
  if (type === "avatar") {
    return (
      <div className={`rounded-full bg-${activeTheme}-200/50 dark:bg-${activeTheme}-700/50 animate-pulse h-12 w-12 ${className}`}></div>
    );
  }
  
  // Default text skeleton
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i} 
          className={`h-4 bg-${activeTheme}-200/50 dark:bg-${activeTheme}-700/50 rounded animate-pulse`}
          style={{ width: `${100 - (i * 10 % 30)}%` }}
        ></div>
      ))}
    </div>
  );
};

// Spinning loading indicator with module theming
export const LoadingSpinner = ({ size = "md", className = "", module }) => {
  const { currentModule, theme: moduleTheme } = useModuleTheme();
  const activeModule = module || currentModule;
  const activeTheme = module ? `${module}` : moduleTheme.color;
  
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
          border-${activeTheme}-200/50 dark:border-${activeTheme}-900/30
          border-t-${activeTheme}-500
        `}
      />
    </div>
  );
};

// Full-screen loading view with module theming
export const LoadingScreen = ({ message = "Loading...", module }) => {
  const { theme: moduleTheme } = useModuleTheme();
  const activeTheme = module ? `${module}` : moduleTheme.color;
  const emoji = module 
    ? moduleTheme.name.split(' ')[1] 
    : moduleTheme.name.split(' ')[1];
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[80vh] flex items-center justify-center"
    >
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" module={module} />
        <motion.div
          initial={{ y: 5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className={`font-medium text-${activeTheme}-600 dark:text-${activeTheme}-400`}>
            {message} {emoji}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Modal-style loading overlay with module theming
export const LoadingOverlay = ({ message = "Loading...", module }) => {
  const { theme: moduleTheme } = useModuleTheme();
  const activeTheme = module ? `${module}` : moduleTheme.color;
  const emoji = module 
    ? moduleTheme.name.split(' ')[1] 
    : moduleTheme.name.split(' ')[1];
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm 
        bg-white/50 dark:bg-gray-900/50 border-t-4 border-${activeTheme}-500`}
    >
      <div className="text-center space-y-4 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl">
        <LoadingSpinner size="lg" module={module} />
        <motion.div
          initial={{ y: 5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className={`font-medium text-${activeTheme}-600 dark:text-${activeTheme}-400`}>
            {message} {emoji}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Loading button with module theming
export const LoadingButton = ({ children, loading, module, loadingText = "Loading...", ...props }) => {
  const { theme: moduleTheme } = useModuleTheme();
  const activeTheme = module ? `${module}` : moduleTheme.color;
  const emoji = module 
    ? moduleTheme.name.split(' ')[1] 
    : moduleTheme.name.split(' ')[1];
  
  return (
    <button
      disabled={loading}
      className={`relative inline-flex items-center justify-center ${props.className || ""}`}
      {...props}
    >
      {loading ? (
        <motion.div 
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          className="flex items-center"
        >
          <LoadingSpinner size="sm" module={module} className="mr-2" />
          <span>{loadingText}</span>
        </motion.div>
      ) : (
        children
      )}
    </button>
  );
};
