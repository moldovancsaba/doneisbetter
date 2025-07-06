'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * ErrorBoundary Component
 * 
 * A React error boundary component that catches JavaScript errors anywhere in their child
 * component tree and displays a fallback UI instead of the component tree that crashed.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error);
    console.error('Component stack:', errorInfo.componentStack);
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900">
          <h2 className="text-red-800 dark:text-red-200 font-semibold mb-2">Something went wrong</h2>
          <p className="text-red-600 dark:text-red-300">
            The component failed to render. Please try refreshing the page.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
