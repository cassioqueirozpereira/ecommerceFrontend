'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, User } from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { Container } from '../ui/Container';
import { SearchModal } from './SearchModal';

export function Header() {
  const { setIsOpen, items } = useCartStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    setMounted(true);
  }, []);

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
            
            {/* User Account / Dynamic Profile */}
            <div className="relative flex items-center">
              {!mounted ? (
                // Safe placeholder during server rendering/hydration
                <div className="p-2 text-obsidian">
                  <User size={20} />
                </div>
              ) : isAuthenticated ? (
                <div className="relative">
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="p-2 text-obsidian hover:text-graphite transition-colors flex items-center justify-center focus:outline-none"
                    aria-label="Menu da conta"
                  >
                    {/* Dynamic circular letter-avatar */}
                    <div className="h-8 w-8 rounded-full bg-champagne text-obsidian flex items-center justify-center text-sm font-semibold tracking-wider border border-obsidian/10 shadow-sm transition-transform duration-300 hover:scale-105">
                      {user?.firstName ? user.firstName[0].toUpperCase() : (user?.email ? user.email[0].toUpperCase() : 'U')}
                    </div>
                  </button>

                  {isUserMenuOpen && (
                    <>
                      {/* Desktop Backdrop & Dropdown Menu */}
                      <div className="hidden md:block fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                      <div className="hidden md:block absolute right-0 mt-2 w-56 bg-ivory border border-graphite/10 shadow-xl rounded-md py-2 z-50 animate-fade-in">
                        <div className="px-4 py-2.5 border-b border-graphite/5 bg-obsidian/[0.02]">
                          <p className="text-[10px] text-graphite uppercase tracking-widest font-semibold">Sua Conta</p>
                          <p className="text-sm font-medium text-obsidian truncate mt-0.5">
                            {user?.firstName ? `Olá, ${user.firstName}` : user?.email}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                            toast.success('Desconectado com sucesso.');
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50/50 hover:text-red-700 transition-colors font-medium"
                        >
                          Sair da Conta
                        </button>
                      </div>

                      {/* Mobile Bottom Sheet & Blur Overlay */}
                      <div 
                        className="md:hidden fixed inset-0 bg-obsidian/40 backdrop-blur-sm z-40 transition-opacity animate-fade-in" 
                        onClick={() => setIsUserMenuOpen(false)} 
                      />
                      <div className="md:hidden fixed bottom-0 inset-x-0 bg-ivory rounded-t-2xl border-t border-graphite/15 shadow-2xl p-6 pb-8 z-50 animate-slide-up">
                        <div className="w-12 h-1 bg-graphite/20 rounded-full mx-auto mb-6" />
                        <div className="mb-6">
                          <p className="text-xs text-graphite uppercase tracking-widest font-semibold">Minha Conta</p>
                          <p className="text-xl font-serif text-obsidian mt-1.5 truncate">
                            {user?.firstName ? `Olá, ${user.firstName}` : user?.email}
                          </p>
                        </div>
                        <div className="space-y-3">
                          <button
                            onClick={() => {
                              logout();
                              setIsUserMenuOpen(false);
                              toast.success('Desconectado com sucesso.');
                            }}
                            className="w-full h-12 bg-obsidian text-ivory hover:bg-graphite rounded-md font-medium transition-colors text-sm shadow-sm"
                          >
                            Sair da Conta
                          </button>
                          <button
                            onClick={() => setIsUserMenuOpen(false)}
                            className="w-full h-12 border border-graphite/20 text-obsidian hover:bg-graphite/5 rounded-md font-medium transition-colors text-sm"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link 
                  href="/login" 
                  className="p-2 text-obsidian hover:text-graphite transition-colors block"
                  aria-label="Entrar na conta"
                >
                  <User size={20} />
                </Link>
              )}
            </div>

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