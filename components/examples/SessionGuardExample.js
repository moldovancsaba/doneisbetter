import { useState, useEffect } from 'react';
import { useSessionGuard } from '../../hooks/useSessionGuard';
import { useSession } from '../../contexts/SessionContext';

/**
 * SessionGuardExample component
 * 
 * This component demonstrates the proper usage of the useSessionGuard hook
 * with different configurations, showing how to:
 * 
 * 1. Wait for session to be ready before making API calls
 * 2. Handle loading states appropriately
 * 3. Handle error states and retry logic
 * 4. Work with both session-only and user-required states
 * 5. Use the hook with dependencies for reevaluation
 * 
 * @returns {JSX.Element} A component with multiple useSessionGuard examples
 */
const SessionGuardExample = () => {
  // Example 1: Basic session guard without requiring userId
  const sessionGuard = useSessionGuard({
    onReady: ({ sessionId }) => {
      console.log('Basic session guard is ready with sessionId:', sessionId);
    },
    onError: (error) => {
      console.error('Basic session guard error:', error);
    }
  });

  // Example 2: Session guard that requires userId
  const userSessionGuard = useSessionGuard({
    requireUserId: true,
    onReady: ({ sessionId, userId }) => {
      console.log('User session guard is ready with sessionId:', sessionId, 'and userId:', userId);
    },
    onError: (error) => {
      console.error('User session guard error:', error);
    }
  });

  // Example 3: Session guard with dependencies for data fetching
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [sessionsData, setSessionsData] = useState(null);
  const [isSessionsLoading, setSessionsLoading] = useState(false);
  const [sessionsError, setSessionsError] = useState(null);

  const dataSessionGuard = useSessionGuard({
    dependencies: [refreshTrigger],
    onReady: async ({ sessionId }) => {
      console.log('Data session guard is ready, fetching sessions');
      await fetchSessions(sessionId);
    }
  });

  // Example of a function that should only be called when the session is ready
  const fetchSessions = async (sessionId) => {
    if (!sessionId) return;

    try {
      setSessionsLoading(true);
      setSessionsError(null);

      const response = await fetch(`/api/sessions?sessionId=${sessionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch sessions: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setSessionsData(data.data);
        console.log('Successfully fetched session data');
      } else {
        throw new Error(data.error || 'Unknown error fetching sessions');
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setSessionsError(error.message);
    } finally {
      setSessionsLoading(false);
    }
  };

  // Example 4: Getting direct access to session for manual operations
  const { sessionId, userId, refreshSession } = useSession();
  const [manualApiResult, setManualApiResult] = useState(null);
  const [isManualLoading, setManualLoading] = useState(false);
  const [manualError, setManualError] = useState(null);
  
  // Function that demonstrates manual session checking before API call
  const handleManualApiCall = async () => {
    // First manually check if session is valid
    if (!sessionId) {
      setManualError('No session ID available');
      return;
    }
    
    try {
      setManualLoading(true);
      setManualError(null);
      
      // Example API call using session ID
      const response = await fetch(`/api/sessions?sessionId=${sessionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      const data = await response.json();
      setManualApiResult(data);
    } catch (error) {
      console.error('Manual API call error:', error);
      setManualError(error.message);
    } finally {
      setManualLoading(false);
    }
  };
  
  // Refresh data with dependency
  const handleRefreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="session-guard-examples">
      <h1>Session Guard Examples</h1>
      
      {/* Example 1: Basic session guard without requiring userId */}
      <section className="example">
        <h2>Basic Session Guard</h2>
        {sessionGuard.isLoading ? (
          <div className="loading-state">
            <p>Loading session...</p>
          </div>
        ) : sessionGuard.isError ? (
          <div className="error-state">
            <p>Error: {sessionGuard.error}</p>
            <button onClick={sessionGuard.retrySession}>Retry</button>
          </div>
        ) : sessionGuard.isReady ? (
          <div className="ready-state">
            <p>Session is ready!</p>
            <p>Session ID: {sessionGuard.sessionId}</p>
            {sessionGuard.userId && <p>User ID: {sessionGuard.userId}</p>}
          </div>
        ) : null}
      </section>
      
      {/* Example 2: Session guard that requires userId */}
      <section className="example">
        <h2>User-Required Session Guard</h2>
        {userSessionGuard.isLoading ? (
          <div className="loading-state">
            <p>Loading user session...</p>
          </div>
        ) : userSessionGuard.isError ? (
          <div className="error-state">
            <p>Error: {userSessionGuard.error}</p>
            <button onClick={userSessionGuard.retrySession}>Retry</button>
          </div>
        ) : userSessionGuard.isReady ? (
          <div className="ready-state">
            <p>User session is ready!</p>
            <p>Session ID: {userSessionGuard.sessionId}</p>
            <p>User ID: {userSessionGuard.userId}</p>
          </div>
        ) : null}
      </section>
      
      {/* Example 3: Session guard with data fetching */}
      <section className="example">
        <h2>Data Fetching with Session Guard</h2>
        {dataSessionGuard.isLoading || isSessionsLoading ? (
          <div className="loading-state">
            <p>Loading session data...</p>
          </div>
        ) : dataSessionGuard.isError ? (
          <div className="error-state">
            <p>Session Error: {dataSessionGuard.error}</p>
            <button onClick={dataSessionGuard.retrySession}>Retry Session</button>
          </div>
        ) : sessionsError ? (
          <div className="error-state">
            <p>Data Error: {sessionsError}</p>
            <button onClick={handleRefreshData}>Retry Data Fetch</button>
          </div>
        ) : dataSessionGuard.isReady && sessionsData ? (
          <div className="ready-state">
            <p>Session data loaded successfully!</p>
            <div className="data-display">
              <h3>Session Details</h3>
              <pre>{JSON.stringify(sessionsData, null, 2)}</pre>
            </div>
            <button onClick={handleRefreshData}>Refresh Data</button>
          </div>
        ) : (
          <div className="ready-state">
            <p>Session ready, but no data loaded yet.</p>
            <button onClick={handleRefreshData}>Load Data</button>
          </div>
        )}
      </section>
      
      {/* Example 4: Manual session handling */}
      <section className="example">
        <h2>Manual Session Handling</h2>
        <div className="manual-controls">
          <p>Current Session ID: {sessionId || 'None'}</p>
          <p>Current User ID: {userId || 'None'}</p>
          <button 
            onClick={handleManualApiCall}
            disabled={!sessionId || isManualLoading}
          >
            {isManualLoading ? 'Loading...' : 'Make Manual API Call'}
          </button>
          <button 
            onClick={refreshSession}
            disabled={isManualLoading}
          >
            Refresh Session
          </button>
        </div>
        
        {manualError && (
          <div className="error-state">
            <p>Error: {manualError}</p>
          </div>
        )}
        
        {manualApiResult && (
          <div className="data-display">
            <h3>API Result</h3>
            <pre>{JSON.stringify(manualApiResult, null, 2)}</pre>
          </div>
        )}
      </section>
      
      {/* Bonus: SessionGuard implementation notes */}
      <section className="example implementation-notes">
        <h2>Implementation Notes</h2>
        <h3>When to use useSessionGuard:</h3>
        <ul>
          <li>When components need to make API calls that require a valid session</li>
          <li>When you need to ensure the session is fully initialized before rendering content</li>
          <li>When you need to show appropriate loading and error states</li>
          <li>When some functionality requires a user identity (requireUserId: true)</li>
        </ul>
        
        <h3>Best Practices:</h3>
        <ul>
          <li>Always check isReady before making API calls</li>
          <li>Provide clear error messages for each potential failure state</li>
          <li>Use the retrySession function to attempt recovery from errors</li>
          <li>Use dependencies array to trigger reevaluation when necessary</li>
          <li>Use onReady callback for initialization logic</li>
          <li>Use onError callback for error handling</li>
          <li>Include proper timestamp formatting (ISO 8601 with milliseconds): {new Date().toISOString()}</li>
        </ul>
      </section>
      
      <style jsx>{`
        .session-guard-examples {
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .example {
          margin-bottom: 30px;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background-color: #f9f9f9;
        }
        
        .loading-state {
          padding: 15px;
          background-color: #e8f4fd;
          border-radius: 4px;
        }
        
        .error-state {
          padding: 15px;
          background-color: #fdeeee;
          border-radius: 4px;
          color: #d32f2f;
        }
        
        .ready-state {
          padding: 15px;
          background-color: #e8f5e9;
          border-radius: 4px;
        }
        
        button {
          padding: 8px 16px;
          margin: 8px 8px 8px 0;
          background-color: #1976d2;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        button:hover {
          background-color: #1565c0;
        }
        
        button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
        
        .data-display {
          margin-top: 15px;
          padding: 10px;
          background-color: #f5f5f5;
          border-radius: 4px;
          overflow: auto;
        }
        
        .data-display pre {
          white-space: pre-wrap;
          word-break: break-all;
        }
        
        .implementation-notes ul {
          margin-left: 20px;
        }
        
        .implementation-notes li {
          margin-bottom: 8px;
        }
      `}</style>
    </div>
  );
};

export default SessionGuardExample;

