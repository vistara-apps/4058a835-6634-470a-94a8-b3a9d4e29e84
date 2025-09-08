'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Loader2, AlertCircle, CheckCircle, Info } from 'lucide-react';

// Loading Spinner Component
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'accent';
  className?: string;
}

export function LoadingSpinner({ size = 'md', color = 'primary', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const colorClasses = {
    primary: 'text-primary',
    secondary: 'text-text-secondary',
    accent: 'text-accent',
  };

  return (
    <Loader2 
      className={cn(
        'animate-spin',
        sizeClasses[size],
        colorClasses[color],
        className
      )} 
    />
  );
}

// Skeleton Loader Component
interface SkeletonProps {
  className?: string;
  lines?: number;
  variant?: 'text' | 'card' | 'avatar' | 'button';
}

export function Skeleton({ className, lines = 1, variant = 'text' }: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-surface rounded';
  
  const variantClasses = {
    text: 'h-4',
    card: 'h-32',
    avatar: 'h-12 w-12 rounded-full',
    button: 'h-10',
  };

  if (variant === 'avatar') {
    return <div className={cn(baseClasses, variantClasses[variant], className)} />;
  }

  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={cn(
            baseClasses,
            variantClasses[variant],
            index === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  );
}

// Loading Card Component
interface LoadingCardProps {
  title?: string;
  description?: string;
  className?: string;
}

export function LoadingCard({ title = 'Loading...', description, className }: LoadingCardProps) {
  return (
    <div className={cn('glass-card p-6 text-center', className)}>
      <div className="relative mb-4">
        <div className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto" />
        <div className="absolute inset-0 w-16 h-16 border-4 border-neon-purple border-b-transparent rounded-full animate-spin mx-auto" 
             style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
      </div>
      
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      
      {description && (
        <p className="text-text-secondary text-sm">{description}</p>
      )}
      
      <div className="flex items-center justify-center space-x-1 mt-4">
        <div className="w-2 h-2 bg-neon-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-neon-purple rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-neon-pink rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}

// Progress Bar Component
interface ProgressBarProps {
  progress: number;
  label?: string;
  showPercentage?: boolean;
  color?: 'primary' | 'accent' | 'success' | 'warning' | 'error';
  className?: string;
}

export function ProgressBar({ 
  progress, 
  label, 
  showPercentage = true, 
  color = 'primary',
  className 
}: ProgressBarProps) {
  const colorClasses = {
    primary: 'from-primary to-primary-600',
    accent: 'from-accent to-accent-600',
    success: 'from-green-500 to-green-600',
    warning: 'from-yellow-500 to-yellow-600',
    error: 'from-red-500 to-red-600',
  };

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm text-text-secondary">{label}</span>}
          {showPercentage && <span className="text-sm text-text-primary font-semibold">{progress}%</span>}
        </div>
      )}
      
      <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
        <div 
          className={cn(
            'h-full bg-gradient-to-r transition-all duration-500 ease-out',
            colorClasses[color]
          )}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
}

// Loading State with Retry
interface LoadingStateProps {
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
  children: ReactNode;
  loadingComponent?: ReactNode;
  emptyState?: ReactNode;
  isEmpty?: boolean;
}

export function LoadingState({
  loading,
  error,
  onRetry,
  children,
  loadingComponent,
  emptyState,
  isEmpty = false,
}: LoadingStateProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-48">
        {loadingComponent || <LoadingCard />}
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-text-primary mb-2">Something went wrong</h3>
        <p className="text-text-secondary text-sm mb-4">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="btn-primary"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  if (isEmpty && emptyState) {
    return <div>{emptyState}</div>;
  }

  return <div>{children}</div>;
}

// Toast Notification Component
interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}

export function Toast({ 
  type, 
  title, 
  message, 
  onClose, 
  autoClose = true, 
  duration = 5000 
}: ToastProps) {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertCircle,
    info: Info,
  };

  const colorClasses = {
    success: 'border-green-500/20 bg-green-500/10 text-green-400',
    error: 'border-red-500/20 bg-red-500/10 text-red-400',
    warning: 'border-yellow-500/20 bg-yellow-500/10 text-yellow-400',
    info: 'border-blue-500/20 bg-blue-500/10 text-blue-400',
  };

  const Icon = icons[type];

  // Auto close functionality
  if (autoClose && onClose) {
    setTimeout(onClose, duration);
  }

  return (
    <div className={cn(
      'glass-card p-4 border rounded-lg shadow-lg max-w-sm',
      colorClasses[type]
    )}>
      <div className="flex items-start space-x-3">
        <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-semibold text-sm">{title}</h4>
          {message && (
            <p className="text-xs mt-1 opacity-90">{message}</p>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-current opacity-70 hover:opacity-100 transition-opacity"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

// Empty State Component
interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action, 
  className 
}: EmptyStateProps) {
  return (
    <div className={cn('text-center py-12', className)}>
      {icon && (
        <div className="mb-4 flex justify-center">
          {icon}
        </div>
      )}
      
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      
      {description && (
        <p className="text-text-secondary text-sm mb-6 max-w-md mx-auto">{description}</p>
      )}
      
      {action && (
        <button
          onClick={action.onClick}
          className="btn-primary"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

// Pulse Loading Animation
interface PulseLoaderProps {
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export function PulseLoader({ 
  count = 3, 
  size = 'md', 
  color = '#00d4ff', 
  className 
}: PulseLoaderProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  return (
    <div className={cn('flex items-center space-x-1', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'rounded-full animate-bounce',
            sizeClasses[size]
          )}
          style={{ 
            backgroundColor: color,
            animationDelay: `${index * 150}ms` 
          }}
        />
      ))}
    </div>
  );
}

export default {
  LoadingSpinner,
  Skeleton,
  LoadingCard,
  ProgressBar,
  LoadingState,
  Toast,
  EmptyState,
  PulseLoader,
};
