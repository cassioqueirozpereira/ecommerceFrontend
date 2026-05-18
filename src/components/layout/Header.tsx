'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, User } from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';
import { Container } from '../ui/Container';
import { SearchModal } from './SearchModal';

export function Header() {
  const { setIsOpen, items } = useCartStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-30 w-full bg-ivory/80 backdrop-blur-md border-b border-graphite/10">
      <Container>
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <h1 className="font-serif text-2xl font-bold tracking-tighter text-obsidian">
              LUXE
            </h1>
          </Link>

          {/* Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/products" className="text-sm font-medium text-graphite hover:text-obsidian transition-colors">
              New Arrivals
            </Link>
            <Link href="/products" className="text-sm font-medium text-graphite hover:text-obsidian transition-colors">
              Perfumes
            </Link>
            <Link href="/products" className="text-sm font-medium text-graphite hover:text-obsidian transition-colors">
              Skincare
            </Link>
            <Link href="/products" className="text-sm font-medium text-graphite hover:text-obsidian transition-colors">
              Collections
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-obsidian hover:text-graphite transition-colors"
            >
              <Search size={20} />
            </button>
            <button className="hidden md:block p-2 text-obsidian hover:text-graphite transition-colors">
              <User size={20} />
            </button>
            <button 
              className="relative p-2 text-obsidian hover:text-graphite transition-colors"
              onClick={() => setIsOpen(true)}
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-obsidian text-[10px] font-bold text-ivory">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </Container>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
}