'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'full';
  children: React.ReactNode;
}

/**
 * Premium button with built-in loading state.
 * Shows a spinning icon + optional loading text when isLoading is true.
 * Automatically disables interaction while loading.
 */
export function LoadingButton({
  isLoading,
  loadingText,
  variant,
  size,
  children,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      disabled={isLoading || props.disabled}
      className={cn('relative', className)}
      {...props}
    >
      <span
        className={cn(
          'inline-flex items-center justify-center gap-2 transition-opacity duration-200',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
      >
        {children}
      </span>

      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center gap-2">
          <Loader2 size={16} className="animate-spin" />
          {loadingText && (
            <span className="text-sm font-medium">{loadingText}</span>
          )}
        </span>
      )}
    </Button>
  );
}
