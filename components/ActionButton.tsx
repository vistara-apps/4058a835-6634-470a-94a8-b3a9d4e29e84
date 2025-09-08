'use client';

import { ButtonHTMLAttributes, ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  pulse?: boolean;
  glow?: boolean;
}

export function ActionButton({ 
  variant = 'primary', 
  size = 'md',
  loading = false,
  className,
  disabled,
  children,
  icon,
  iconPosition = 'left',
  pulse = false,
  glow = false,
  ...props 
}: ActionButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const baseClasses = `
    font-semibold rounded-lg transition-all duration-200 
    flex items-center justify-center gap-2 
    disabled:opacity-50 disabled:cursor-not-allowed
    transform active:scale-95
    relative overflow-hidden
    ${pulse ? 'animate-pulse' : ''}
    ${glow ? 'shadow-lg' : ''}
  `;
  
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    accent: 'btn-accent',
    destructive: 'btn-destructive',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm h-8',
    md: 'px-6 py-3 text-base h-10',
    lg: 'px-8 py-4 text-lg h-12',
  };

  const glowClasses = {
    primary: glow ? 'hover:shadow-neon-blue' : '',
    secondary: glow ? 'hover:shadow-md' : '',
    accent: glow ? 'hover:shadow-lg' : '',
    destructive: glow ? 'hover:shadow-lg' : '',
  };

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        glowClasses[variant],
        isPressed ? 'scale-95' : 'scale-100',
        className
      )}
      disabled={disabled || loading}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {/* Ripple effect overlay */}
      <div className="absolute inset-0 overflow-hidden rounded-lg">
        <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-200" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center gap-2">
        {loading ? (
          <div className="spinner" />
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <span className="flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
                {icon}
              </span>
            )}
            <span className="transition-all duration-200">
              {children}
            </span>
            {icon && iconPosition === 'right' && (
              <span className="flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
                {icon}
              </span>
            )}
          </>
        )}
      </div>

      {/* Shine effect for primary buttons */}
      {variant === 'primary' && !disabled && !loading && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700 ease-out" />
      )}
    </button>
  );
}
