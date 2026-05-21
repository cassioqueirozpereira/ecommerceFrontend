import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'full';
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-champagne disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      primary: "bg-obsidian text-ivory hover:bg-graphite",
      secondary: "bg-champagne text-obsidian hover:bg-champagne-dark",
      outline: "border border-obsidian text-obsidian hover:bg-obsidian/5",
      ghost: "hover:bg-obsidian/5 text-obsidian",
    };

    const sizes = {
      sm: "h-9 px-4 text-sm rounded-md",
      md: "h-11 px-8 text-base rounded-md",
      lg: "h-14 px-10 text-lg rounded-lg",
      full: "h-12 w-full text-base rounded-md",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
