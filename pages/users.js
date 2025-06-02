import React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Layout } from '../components/layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/Loading';
import { useToast } from '../components/ui/Toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync, faExclamationCircle, faUsers } from '@fortawesome/free-solid-svg-icons';

// Error boundary for catching and displaying rendering errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('UserList Error Boundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 my-4">
          <h2 className="text-xl font-bold text-red-800 dark:text-red-200 mb-2">
            <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
            Something went wrong
          </h2>
          <p className="text-red-700 dark:text-red-300 mb-4">
            There was an error rendering the user list component.
          </p>
          <details className="bg-white dark:bg-gray-800 p-3 rounded-md">
            <summary className="text-gray-700 dark:text-gray-300 cursor-pointer">
              Error details
            </summary>
            <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded overflow-auto text-sm">
              <p className="font-mono">{this.state.error?.toString()}</p>
              <pre className="mt-2 text-xs overflow-x-auto">
                {this.state.errorInfo?.componentStack}
              </pre>
            </div>
          </details>
          <Button
            className="mt-4 bg-red-600 hover:bg-red-700 text-white"
            onClick={() => {
              this.setState({ hasError: false, error: null, errorInfo: null });
              this.props.onReset?.();
            }}
          >
            Try Again
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}

// User list component with ISO 8601 timestamps
function UserList({ users, lastRefreshTime }) {
  return (
    <div className="space-y-6">
      {lastRefreshTime && (
        <p className="text-sm text-gray-500">
          Last updated: {new Date(lastRefreshTime).toISOString()}
        </p>
      )}
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <Card
            key={user._id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-1 min-w-0">
                <p className="text-lg font-medium text-gray-900 dark:text-gray-100 truncate">
                  {user.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.email}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Joined: {new Date(user.createdAt).toISOString()}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Last active: {new Date(user.updatedAt).toISOString()}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Main page component
export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastRefreshTime, setLastRefreshTime] = useState(null);
  const { addToast } = useToast();

  // Constants for refresh control 
  const FETCH_COOLDOWN = 5000; // 5 seconds between fetches
  const lastFetchTimeRef = useRef(Date.now());

  // Fetch users data with proper error handling
  const fetchUsers = useCallback(async (showRefreshing = false) => {
    const now = Date.now();
    
    // Check if we're within the cooldown period
    if (lastFetchTimeRef.current && (now - lastFetchTimeRef.current < FETCH_COOLDOWN)) {
      console.log('Skipping fetch - within cooldown period');
      return;
    }

    const startTime = new Date().toISOString();
    console.log(`[${startTime}] Fetching users...`);
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/users', {
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch users: HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch users');
      }
      
      setUsers(data.data.users || []);
      setLastRefreshTime(new Date().toISOString());
      lastFetchTimeRef.current = now;

      if (showRefreshing) {
        addToast('Users list refreshed successfully', 'success');
      }
    } catch (err) {
      console.error(`[${new Date().toISOString()}] Error fetching users:`, err);
      setError(err.message);
      addToast(`Failed to load users: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  // Initial fetch and visibility change handler
  useEffect(() => {
    fetchUsers();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const now = Date.now();
        if (now - lastFetchTimeRef.current > FETCH_COOLDOWN) {
          console.log('Page became visible, refreshing data...');
          fetchUsers();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchUsers]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchUsers();
  };

  return (
    <ErrorBoundary>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Users</h1>
            {!loading && (
              <Button
                onClick={() => fetchUsers(true)}
                variant="primary"
                className="flex items-center"
              >
                <FontAwesomeIcon icon={faSync} className="mr-2" />
                Refresh
              </Button>
            )}
          </div>
          
          {loading && (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner />
              <span className="ml-3">Loading users...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faExclamationCircle} className="text-red-400 mr-2" />
                <div>
                  <p className="text-sm text-red-800">{error}</p>
                  <button
                    onClick={handleRetry}
                    className="mt-2 inline-flex items-center text-sm font-medium text-red-600 hover:text-red-800"
                  >
                    <FontAwesomeIcon icon={faSync} className="mr-1" />
                    Retry
                  </button>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && users.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <FontAwesomeIcon icon={faUsers} className="text-4xl mb-3" />
              <p>No users found.</p>
            </div>
          )}

          {!loading && !error && users.length > 0 && (
            <UserList users={users} lastRefreshTime={lastRefreshTime} />
          )}
        </div>
      </Layout>
    </ErrorBoundary>
  );
}

