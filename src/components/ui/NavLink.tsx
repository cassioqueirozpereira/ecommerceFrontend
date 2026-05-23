import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  /** Marks this link as the active/current route for styling. */
  isActive?: boolean;
  className?: string;
}

/**
 * Navigation link used in Header and future nav components.
 * Applies the consistent text-graphite → hover:text-obsidian style.
 */
export function NavLink({ href, children, isActive, className }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'text-sm font-medium transition-colors',
        isActive
          ? 'text-obsidian font-semibold'
          : 'text-graphite hover:text-obsidian',
        className
      )}
    >
      {children}
    </Link>
  );
}
