// Error logging utility
export const logError = (error, context, additionalInfo = {}) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ${context}:`, error, additionalInfo);
};

// Create error response for API endpoints
export const createErrorResponse = (error, context) => {
  const timestamp = new Date().toISOString();
  return {
    success: false,
    error: {
      message: error.message || 'An unexpected error occurred',
      code: error.code || 'UNKNOWN_ERROR',
      context,
      timestamp
    }
  };
};

// Session error handling
export const handleSessionError = (error) => {
  const timestamp = new Date().toISOString();
  logError(error, 'Session');
  
  return {
    message: 'Session error occurred',
    code: 'SESSION_ERROR',
    timestamp
  };
};

// API error handling
export const handleApiError = (error) => {
  const timestamp = new Date().toISOString();
  logError(error, 'API');

  return {
    message: 'API error occurred',
    code: 'API_ERROR',
    timestamp
  };
};

// Database error handling
export const handleDbError = (error) => {
  const timestamp = new Date().toISOString();
  logError(error, 'Database');

  return {
    message: 'Database error occurred',
    code: 'DB_ERROR',
    timestamp
  };
};

