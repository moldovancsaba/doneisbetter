import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { handleSessionError, logError } from '../utils/error';
import { toISOWithMillisec } from '../utils/dates';

// Create the context
const SessionContext = createContext();

// Constants
export const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const SESSION_ID_KEY = 'done_session_id';
const USER_ID_KEY = 'done_user_id';

// Session status constants
const SESSION_STATUS = {
  INITIALIZING: 'initializing',
  LOADING: 'loading',
  ACTIVE: 'active',
  ERROR: 'error',
  EXPIRED: 'expired',
};

export const SessionProvider = ({ children }) => {
  const [sessionId, setSessionId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [status, setStatus] = useState(SESSION_STATUS.INITIALIZING);
  const [error, setError] = useState(null);
  const [lastActive, setLastActive] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isReady, setIsReady] = useState(false);
  
  // Use refs to track pending operations and prevent duplicates
  const pendingRegistration = useRef(false);
  const pendingRefresh = useRef(false);
  const registrationAttempts = useRef(0);
  const lastHeartbeat = useRef(Date.now());
  const initializationComplete = useRef(false);

  // Initialize session ID
  useEffect(() => {
    const initializeSession = async () => {
      try {
        // Set initializing state
        setIsInitializing(true);
        setStatus(SESSION_STATUS.INITIALIZING);
        
        // Try to get existing session ID from localStorage
        let storedSessionId = localStorage.getItem(SESSION_ID_KEY);
        let storedUserId = localStorage.getItem(USER_ID_KEY);
        const currentTime = toISOWithMillisec(new Date());

        if (!storedSessionId) {
          // Create a new session ID if not found
          storedSessionId = uuidv4();
          localStorage.setItem(SESSION_ID_KEY, storedSessionId);
          console.log(`Created new session ID: ${storedSessionId}`);
        } else {
          console.log(`Using existing session ID: ${storedSessionId}`);
        }

        // Update state with session and user IDs
        setSessionId(storedSessionId);
        if (storedUserId) {
          setUserId(storedUserId);
        }
        
        setLastActive(currentTime);
        
        // Wait for state updates to complete before registration
        await new Promise(resolve => setTimeout(resolve, 0));
        
        // Register session with backend
        const registrationResult = await registerSession(storedSessionId, storedUserId);
        
        // Mark initialization as complete regardless of registration result
        initializationComplete.current = true;
        setIsInitializing(false);
        
        // Mark the session as ready only when registration is complete and successful
        setIsReady(registrationResult);
        
        return registrationResult;
      } catch (err) {
        console.error('Session initialization error:', err);
        setError(err.message);
        setStatus(SESSION_STATUS.ERROR);
        setIsInitializing(false);
        initializationComplete.current = true;
        setIsReady(false);
        return false;
      }
    };

    initializeSession();
  }, []);

  // Validate session and user IDs
  const validateSessionData = (sid, uid) => {
    if (!sid || typeof sid !== 'string' || sid.trim() === '') {
      return { valid: false, error: 'Invalid or missing session ID' };
    }
    
    // User ID can be null but if provided must be valid
    if (uid && (typeof uid !== 'string' || uid.trim() === '')) {
      return { valid: false, error: 'Invalid user ID format' };
    }
    
    return { valid: true };
  };

  // Register session with backend
  const registerSession = async (sid, uid) => {
    // Validate input parameters
    const validation = validateSessionData(sid, uid);
    if (!validation.valid) {
      console.error('Session validation failed:', validation.error);
      setError(validation.error);
      setStatus(SESSION_STATUS.ERROR);
      return false;
    }
    
    // Prevent multiple simultaneous registrations
    if (pendingRegistration.current) {
      console.log('Session registration already in progress, skipping duplicate request');
      return false;
    }
    
    pendingRegistration.current = true;
    registrationAttempts.current += 1;
    
    try {
      setStatus(SESSION_STATUS.LOADING);
      console.log(`Registering session: ${sid}, user: ${uid || 'none'}, attempt: ${registrationAttempts.current}`);
      
      // Use the sessions API endpoint for session management
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sid,
          userId: uid || undefined,
          userAgent: navigator.userAgent,
          createdAt: toISOWithMillisec(new Date())
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to register session';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
        }
        
        // For server errors, retry up to 3 times with exponential backoff
        if (response.status >= 500 && registrationAttempts.current < 3) {
          console.log(`Server error during registration, will retry (attempt ${registrationAttempts.current})`);
          pendingRegistration.current = false;
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, registrationAttempts.current - 1)));
          return registerSession(sid, uid);
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      if (data.success) {
        setStatus(SESSION_STATUS.ACTIVE);
        setIsRegistered(true);
        setLastActive(toISOWithMillisec(new Date()));
        lastHeartbeat.current = Date.now();
        setIsReady(true);
        console.log('Session registered successfully:', data);
        
        // If this is a new user ID from the server, update local state
        if (data.data && data.data.userId && (!uid || uid !== data.data.userId)) {
          console.log(`Updating user ID from server: ${data.data.userId}`);
          localStorage.setItem(USER_ID_KEY, data.data.userId);
          setUserId(data.data.userId);
          
          // Wait for state update to complete
          await new Promise(resolve => setTimeout(resolve, 0));
        }
        
        return true;
      } else {
        throw new Error(data.error || 'Unknown error registering session');
      }
    } catch (err) {
      console.error('Session registration error:', err);
      setError(err.message);
      setStatus(SESSION_STATUS.ERROR);
      setIsReady(false);
      return false;
    } finally {
      pendingRegistration.current = false;
    }
  };

  // Function to refresh session
  const refreshSession = useCallback(async () => {
    // Check if initialization is complete
    if (!initializationComplete.current) {
      console.log('Session initialization not complete, deferring refresh');
      return false;
    }
    
    // Prevent multiple simultaneous refreshes and throttle requests
    if (pendingRefresh.current) {
      console.log('Session refresh already in progress, skipping duplicate request');
      return false;
    }
    
    // Implement throttling - only refresh if it's been at least 10 seconds since last heartbeat
    const now = Date.now();
    if (now - lastHeartbeat.current < 10000) {
      console.log('Throttling session refresh, last heartbeat too recent');
      return false;
    }
    
    pendingRefresh.current = true;
    
    try {
      // Validate session ID
      if (!sessionId) {
        throw new Error('No session ID available for refresh');
      }
      
      // Validate that session ID is properly formatted
      const validation = validateSessionData(sessionId, userId);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      setStatus(SESSION_STATUS.LOADING);
      console.log(`Refreshing session: ${sessionId}`);
      
      // Use the sessions API endpoint for session refresh
      const response = await fetch(`/api/sessions?sessionId=${sessionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        let errorMessage = 'Failed to refresh session';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
        }
        
        if (response.status === 404) {
          console.log('Session not found, creating a new one');
          // Session expired or not found - create a new one
          localStorage.removeItem(SESSION_ID_KEY);
          const newSessionId = uuidv4();
          localStorage.setItem(SESSION_ID_KEY, newSessionId);
          setSessionId(newSessionId);
          pendingRefresh.current = false; // Reset flag before calling registerSession
          await registerSession(newSessionId, userId);
          return;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      if (data.success) {
        setStatus(SESSION_STATUS.ACTIVE);
        setIsRegistered(true); // Ensure registered flag is set
        setLastActive(toISOWithMillisec(new Date()));
        lastHeartbeat.current = now;
        setIsReady(true);
        
        // If this session has a user ID and we don't, update local state
        if (data.data && data.data.userId && !userId) {
          console.log(`Updating user ID from session: ${data.data.userId}`);
          localStorage.setItem(USER_ID_KEY, data.data.userId);
          setUserId(data.data.userId);
          
          // Wait for state update to complete
          await new Promise(resolve => setTimeout(resolve, 0));
        }
        
        console.log('Session refreshed successfully');
        return true;
      } else {
        throw new Error(data.error || 'Unknown error refreshing session');
      }
    } catch (err) {
      console.error('Session refresh error:', err);
      setError(err.message);
      setStatus(SESSION_STATUS.ERROR);
      setIsReady(false);
      return false;
    } finally {
      pendingRefresh.current = false;
    }
  }, [sessionId, userId]);

  // Set user ID and link it with the current session
  const setUserIdentity = useCallback(async (newUserId) => {
    try {
      // Check if initialization is complete
      if (!initializationComplete.current) {
        console.log('Session initialization not complete, deferring user identity update');
        return false;
      }
      
      // Ensure session is registered
      if (!isRegistered) {
        const regResult = await registerSession(sessionId, null);
        if (!regResult) {
          throw new Error('Failed to register session');
        }
      }
      
      // Validate session ID and new user ID
      if (!sessionId) {
        throw new Error('No session ID available');
      }
      
      if (!newUserId || typeof newUserId !== 'string' || newUserId.trim() === '') {
        throw new Error('Invalid user ID format');
      }

      setStatus(SESSION_STATUS.LOADING);
      console.log(`Updating session with user ID: ${newUserId}`);
      
      // Store in localStorage first
      localStorage.setItem(USER_ID_KEY, newUserId);
      setUserId(newUserId);
      
      // Update session with new user ID using the sessions API
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          userId: newUserId,
          userAgent: navigator.userAgent,
          updatedAt: toISOWithMillisec(new Date())
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to update session with user ID';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      if (data.success) {
        console.log('Session updated with user ID:', newUserId);
        // Update local state
        localStorage.setItem(USER_ID_KEY, newUserId);
        setUserId(newUserId);
        // Update last active time
        setStatus(SESSION_STATUS.ACTIVE);
        setLastActive(toISOWithMillisec(new Date()));
        lastHeartbeat.current = Date.now();
        setIsReady(true);
        return true;
      } else {
        throw new Error(data.error || 'Unknown error updating session with user ID');
      }
    } catch (err) {
      console.error('Set user identity error:', err);
      setError(err.message);
      setStatus(SESSION_STATUS.ERROR);
      setIsReady(false);
      return false;
    }
  }, [sessionId]);

  // Heartbeat to keep session active with improved throttling
  useEffect(() => {
    if (status !== SESSION_STATUS.ACTIVE) return;

    console.log('Setting up session heartbeat');
    const interval = setInterval(() => {
      // Only refresh if it's been at least 5 minutes since last heartbeat
      const now = Date.now();
      if (now - lastHeartbeat.current >= 5 * 60 * 1000) {
        console.log('Sending session heartbeat');
        refreshSession();
      } else {
        console.log('Skipping heartbeat, last heartbeat too recent');
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => {
      console.log('Clearing session heartbeat');
      clearInterval(interval);
    };
  }, [status, refreshSession]);

  // Clear session and create a new one
  const clearSession = useCallback(async () => {
    try {
      console.log('Clearing current session');
      
      // Clear from localStorage
      localStorage.removeItem(SESSION_ID_KEY);
      localStorage.removeItem(USER_ID_KEY);
      
      // Reset user ID state
      setUserId(null);
      
      if (sessionId) {
        // Inform backend about session termination using the sessions API
        await fetch(`/api/sessions?sessionId=${sessionId}`, {
          method: 'DELETE',
        });
      }
      
      // Create a new session
      const newSessionId = uuidv4();
      localStorage.setItem(SESSION_ID_KEY, newSessionId);
      setSessionId(newSessionId);
      setStatus(SESSION_STATUS.INITIALIZING);
      setIsReady(false);
      
      // Register the new session with no user ID
      await registerSession(newSessionId, null);
      
    } catch (err) {
      console.error('Clear session error:', err);
      setError(err.message);
      setIsReady(false);
    }
  }, [sessionId]);
  
  // Switch user - clear current user but keep session
  const switchUser = useCallback(async () => {
    try {
      console.log('Switching user');
      
      // Clear user from localStorage but keep session
      localStorage.removeItem(USER_ID_KEY);
      
      // Reset user ID state
      setUserId(null);
      
      // Update the session to remove user association
      if (sessionId) {
        await fetch('/api/sessions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId,
            userId: null, // Clear the user ID
            userAgent: navigator.userAgent,
          }),
        });
      }
      
      console.log('User switched successfully');
    } catch (err) {
      console.error('Switch user error:', err);
      setError(err.message);
      setIsReady(false);
    }
  }, [sessionId]);

  return (
    <SessionContext.Provider value={{
      sessionId,
      userId,
      status,
      error,
      lastActive,
      isRegistered,
      isInitializing,
      isReady,
      refreshSession,
      clearSession,
      setUserIdentity,
      switchUser,
      toISOWithMillisec,
      validateSessionData,
      registerSession
    }}>
      {children}
    </SessionContext.Provider>
  );
};

// Custom hook to use the session context
export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

