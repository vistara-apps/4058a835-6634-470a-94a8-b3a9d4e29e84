'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="glass-card p-8 max-w-lg w-full text-center">
            <div className="mb-6">
              <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-text-primary mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-text-secondary">
                We encountered an unexpected error. Don't worry, our team has been notified.
              </p>
            </div>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-left">
                <div className="flex items-center mb-2">
                  <Bug className="w-4 h-4 text-red-400 mr-2" />
                  <span className="text-sm font-semibold text-red-400">Development Error Details</span>
                </div>
                <div className="text-xs text-red-300 font-mono">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error.message}
                  </div>
                  {this.state.error.stack && (
                    <div className="max-h-32 overflow-y-auto">
                      <strong>Stack:</strong>
                      <pre className="whitespace-pre-wrap text-xs mt-1">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="btn-primary flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="btn-secondary flex items-center justify-center space-x-2"
              >
                <Home className="w-4 h-4" />
                <span>Go Home</span>
              </button>
            </div>

            {/* Help Text */}
            <div className="mt-6 pt-6 border-t border-border/30">
              <p className="text-xs text-text-secondary">
                If this problem persists, please contact our support team with the error details above.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook-based error boundary for functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo);
    
    // You can integrate with error reporting services here
    // Example: Sentry.captureException(error);
  };
}

// Simple error fallback component
interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
  title?: string;
  message?: string;
}

export function ErrorFallback({ 
  error, 
  resetError, 
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again."
}: ErrorFallbackProps) {
  return (
    <div className="glass-card p-6 text-center">
      <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary text-sm mb-4">{message}</p>
      
      {process.env.NODE_ENV === 'development' && error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-left">
          <div className="text-xs text-red-300 font-mono">
            {error.message}
          </div>
        </div>
      )}
      
      {resetError && (
        <button
          onClick={resetError}
          className="btn-primary"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

// Network error component
interface NetworkErrorProps {
  onRetry?: () => void;
  message?: string;
}

export function NetworkError({ 
  onRetry, 
  message = "Unable to connect to the server. Please check your internet connection." 
}: NetworkErrorProps) {
  return (
    <div className="glass-card p-6 text-center">
      <div className="w-16 h-16 mx-auto mb-4 relative">
        <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping" />
        <div className="relative w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-text-primary mb-2">Connection Error</h3>
      <p className="text-text-secondary text-sm mb-4">{message}</p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-primary flex items-center justify-center space-x-2 mx-auto"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
}

// 404 Not Found component
interface NotFoundProps {
  title?: string;
  message?: string;
  onGoHome?: () => void;
}

export function NotFound({ 
  title = "Page Not Found",
  message = "The page you're looking for doesn't exist or has been moved.",
  onGoHome
}: NotFoundProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card p-8 max-w-lg w-full text-center">
        <div className="text-6xl font-bold text-neon-blue mb-4">404</div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">{title}</h1>
        <p className="text-text-secondary mb-6">{message}</p>
        
        <button
          onClick={onGoHome || (() => window.location.href = '/')}
          className="btn-primary flex items-center justify-center space-x-2 mx-auto"
        >
          <Home className="w-4 h-4" />
          <span>Go Home</span>
        </button>
      </div>
    </div>
  );
}

export default ErrorBoundary;
