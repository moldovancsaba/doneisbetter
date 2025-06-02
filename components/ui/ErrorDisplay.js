import React from 'react';

const ErrorDisplay = ({ error }) => {
  return (
    <div className="p-4 border border-red-500 rounded-lg bg-red-50 dark:bg-red-900/10">
      <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-2">
        An error occurred
      </h3>
      <p className="text-red-600 dark:text-red-400">
        {error?.message || 'Something went wrong'}
      </p>
      <p className="text-sm text-red-500 dark:text-red-500 mt-2">
        {error?.timestamp || new Date().toISOString()}
      </p>
    </div>
  );
};

export default ErrorDisplay;

