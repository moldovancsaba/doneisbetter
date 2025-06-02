import { useState, useEffect } from 'react';
import { useSession } from '../contexts/SessionContext';

/**
 * Custom hook to ensure components wait for the session to be ready before proceeding.
 * This hook provides a consistent way to handle session dependencies in components.
 * 
 * @param {Object} options - Configuration options
 * @param {Array} options.dependencies - Optional array of dependencies to trigger reevaluation
 * @param {boolean} options.requireUserId - Whether a userId is required (default: false)
 * @param {Function} options.onReady - Optional callback to execute when session is ready
 * @param {Function} options.onError - Optional callback to execute when session has an error
 * @returns {Object} Session guard state: { isLoading, isError, isReady, error, sessionId, userId }
 */
export const useSessionGuard = (options = {}) => {
  const { 
    dependencies = [], 
    requireUserId = false,
    onReady,
    onError
  } = options;

  // Get session context data
  const { 
    sessionId, 
    userId, 
    status,
    error: sessionError,
    isRegistered,
    isReady,
    isInitializing,
    refreshSession
  } = useSession();

  // Local state for the hook
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const [sessionReady, setSessionReady] = useState(false);

  // Effect for session state checking
  useEffect(() => {
    // Reset states
    setIsLoading(true);
    setIsError(false);
    setError(null);
    setSessionReady(false);

    // Check session initialization state
    if (isInitializing || status === 'initializing') {
      console.log('Session is initializing, waiting...');
      setIsLoading(true);
      return;
    }

    // Check for session errors
    if (status === 'error' || sessionError) {
      console.error('Session error detected:', sessionError);
      setIsError(true);
      setError(sessionError || 'Unknown session error');
      setIsLoading(false);
      
      // Call onError callback if provided
      if (onError && typeof onError === 'function') {
        onError(sessionError);
      }
      return;
    }

    // Check if session ID exists
    if (!sessionId) {
      console.error('No session ID available');
      setIsError(true);
      setError('No session ID available. Please refresh the page.');
      setIsLoading(false);
      return;
    }

    // Check if session is registered
    if (!isRegistered) {
      console.log('Session not registered yet, waiting...');
      setIsLoading(true);
      return;
    }

    // Check if session is ready for API calls
    if (!isReady) {
      console.log('Session not ready yet, waiting...');
      setIsLoading(true);
      return;
    }

    // Check if user ID is required and exists
    if (requireUserId && !userId) {
      console.error('User ID required but not available');
      setIsError(true);
      setError('User identity required but not available. Please set a username first.');
      setIsLoading(false);
      return;
    }

    // All checks passed, session is ready
    console.log('Session is ready for API calls');
    setIsLoading(false);
    setSessionReady(true);
    
    // Call onReady callback if provided
    if (onReady && typeof onReady === 'function') {
      onReady({ sessionId, userId });
    }

  }, [
    sessionId, 
    userId, 
    status, 
    sessionError, 
    isRegistered, 
    isReady, 
    isInitializing,
    requireUserId,
    onReady,
    onError,
    ...dependencies
  ]);

  // Attempt to refresh session if there's an error
  const retrySession = async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);
      
      const refreshResult = await refreshSession();
      
      if (!refreshResult) {
        throw new Error('Failed to refresh session');
      }
      
      // Success will be caught by the effect above
    } catch (err) {
      setIsError(true);
      setError(err.message || 'Failed to refresh session');
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    isError,
    isReady: sessionReady,
    error,
    sessionId,
    userId,
    retrySession
  };
};

