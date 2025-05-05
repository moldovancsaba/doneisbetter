'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { toast } from 'react-hot-toast';

/**
 * Properties for the ErrorBoundary component
 */
export interface ErrorBoundaryProps {
  /** The children to be rendered within the boundary */
  children: ReactNode;
  
  /** Custom fallback UI to show when an error occurs (optional) */
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  
  /** Whether to show a toast notification on error (default: true) */
  showToast?: boolean;
  
  /** Custom error handler function (optional) */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  
  /** Custom reset handler (optional) */
  onReset?: () => void;
}

/**
 * State of the ErrorBoundary component
 */
interface ErrorBoundaryState {
  /** Whether an error has occurred */
  hasError: boolean;
  
  /** The error that occurred */
  error: Error | null;
}

/**
 * ErrorBoundary component that catches JavaScript errors in its child component tree
 * and displays a fallback UI instead of crashing the whole application
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  /**
   * Update state when an error occurs
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  /**
   * Handle component errors
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to console
    console.error('Error caught by ErrorBoundary:', error);
    console.error('Component stack:', errorInfo.componentStack);
    
    // Show toast notification if enabled
    if (this.props.showToast !== false) {
      toast.error('Something went wrong. Please try again or refresh the page.');
    }
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // In a production app, you might want to log to an error reporting service
    // Example: logErrorToService(error, errorInfo);
  }

  /**
   * Reset the error state to try recovering
   */
  handleReset = (): void => {
    // Call custom reset handler if provided
    if (this.props.onReset) {
      this.props.onReset();
    }
    
    // Reset the error state
    this.setState({
      hasError: false,
      error: null
    });
  };

  render(): ReactNode {
    // If there is no error, render the children
    if (!this.state.hasError) {
      return this.props.children;
    }

    // If there is an error, render the fallback UI
    if (this.props.fallback) {
      // If fallback is a function, call it with the error and reset handler
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback(this.state.error as Error, this.handleReset);
      }
      
      // Otherwise, render the fallback directly
      return this.props.fallback;
    }

    // Default fallback UI if none provided
    return (
      <div className="p-4 rounded-md bg-red-50 border border-red-200">
        <div className="flex flex-col items-center justify-center p-4 text-center">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-red-600 mb-4">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={this.handleReset}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }
}

/**
 * Function component wrapper for ErrorBoundary to make it easier to use with hooks
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps: Omit<ErrorBoundaryProps, 'children'> = {}
): React.FC<P> {
  return function WithErrorBoundary(props: P): JSX.Element {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

