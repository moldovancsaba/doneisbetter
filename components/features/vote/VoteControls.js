import { motion } from "framer-motion";

export const VoteControls = ({ onVote, disabled, loading }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center"
    >
      <button
        onClick={onVote}
        disabled={disabled}
        className={`
          px-8 py-3 rounded-xl text-lg font-medium
          transition-all duration-200
          ${disabled 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
            : 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg hover:shadow-xl'}
        `}
      >
        {loading ? (
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing
          </div>
        ) : (
          'Vote'
        )}
      </button>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-4 text-xs text-gray-500 dark:text-gray-400"
      >
        {disabled && !loading ? "Select an option first" : ""}
      </motion.div>
    </motion.div>
  );
};

