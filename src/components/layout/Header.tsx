'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { ShoppingBag, Search, User, Menu, X, ChevronDown, ChevronUp, ShieldAlert } from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { Container } from '../ui/Container';
import { NavLink } from '../ui/NavLink';
import { SearchModal } from './SearchModal';
import { NAV_CATEGORIES, FILTER_CATEGORIES, buildCategoryUrl, buildSortUrl } from '@/lib/productUtils';

export function Header() {
  const { setIsOpen, items } = useCartStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-ivory/80 backdrop-blur-md border-b border-graphite/10">
      <Container>
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Left Area: Hamburger + Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 -ml-2 text-obsidian hover:text-graphite transition-colors"
              aria-label="Menu principal"
            >
              <Menu size={24} />
            </button>
            <Link href="/" className="flex-shrink-0">
              <h1 className="font-serif text-2xl font-bold tracking-tighter text-obsidian">
                LUXE
              </h1>
            </Link>
          </div>

          {/* Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {NAV_CATEGORIES.map((cat) => (
              <NavLink key={cat.slug || 'new'} href={buildCategoryUrl(cat.slug)}>
                {cat.label}
              </NavLink>
            ))}
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

                      {/* Mobile Bottom Sheet & Blur Overlay - Portaled to document.body to prevent backdrop-filter stacking context bugs */}
                      {mounted && typeof window !== 'undefined' && createPortal(
                        <>
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
                        </>,
                        document.body
                      )}
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

      {/* Hamburger Menu Drawer */}
      {mounted && typeof window !== 'undefined' && createPortal(
        <>
          {/* Overlay */}
          <div 
            className={`fixed inset-0 bg-obsidian/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setIsMenuOpen(false)}
          />
          {/* Drawer */}
          <div className={`fixed inset-y-0 left-0 w-80 max-w-[80vw] bg-ivory shadow-2xl z-50 transform transition-transform duration-300 flex flex-col ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex items-center justify-between p-6 border-b border-graphite/10">
              <span className="font-serif text-xl font-bold tracking-tighter text-obsidian">MENU</span>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 -mr-2 text-obsidian hover:text-graphite transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-4">
              <div className="px-6 space-y-1">
                {/* Admin Link */}
                <Link 
                  href="/admin" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 py-3 text-obsidian font-medium hover:text-champagne transition-colors border-b border-graphite/5"
                >
                  <ShieldAlert size={18} />
                  <span>Publicar Produtos (Admin)</span>
                </Link>

                {/* Categories Accordion */}
                <div className="border-b border-graphite/5">
                  <button 
                    onClick={() => toggleAccordion('categories')}
                    className="w-full flex items-center justify-between py-4 text-obsidian font-medium hover:text-champagne transition-colors"
                  >
                    <span>Categorias</span>
                    {openAccordion === 'categories' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openAccordion === 'categories' ? 'max-h-64 opacity-100 mb-4' : 'max-h-0 opacity-0'}`}>
                    <ul className="space-y-3 pl-4 border-l border-graphite/10 ml-2">
                      {FILTER_CATEGORIES.map((cat) => (
                        <li key={cat.slug || 'all'}>
                          <Link 
                            href={buildCategoryUrl(cat.slug)}
                            onClick={() => setIsMenuOpen(false)}
                            className="block text-sm text-graphite hover:text-obsidian transition-colors"
                          >
                            {cat.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Sort Accordion */}
                <div className="border-b border-graphite/5">
                  <button 
                    onClick={() => toggleAccordion('sort')}
                    className="w-full flex items-center justify-between py-4 text-obsidian font-medium hover:text-champagne transition-colors"
                  >
                    <span>Ordenar por</span>
                    {openAccordion === 'sort' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openAccordion === 'sort' ? 'max-h-64 opacity-100 mb-4' : 'max-h-0 opacity-0'}`}>
                    <ul className="space-y-3 pl-4 border-l border-graphite/10 ml-2">
                      <li>
                        <Link 
                          href={buildSortUrl('newest')}
                          onClick={() => setIsMenuOpen(false)}
                          className="block text-sm text-graphite hover:text-obsidian transition-colors"
                        >
                          Mais Recentes
                        </Link>
                      </li>
                      <li>
                        <Link 
                          href={buildSortUrl('price_asc')}
                          onClick={() => setIsMenuOpen(false)}
                          className="block text-sm text-graphite hover:text-obsidian transition-colors"
                        >
                          Preço: Menor para Maior
                        </Link>
                      </li>
                      <li>
                        <Link 
                          href={buildSortUrl('price_desc')}
                          onClick={() => setIsMenuOpen(false)}
                          className="block text-sm text-graphite hover:text-obsidian transition-colors"
                        >
                          Preço: Maior para Menor
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Drawer Footer */}
            <div className="p-6 border-t border-graphite/10 bg-ivory/50">
              <p className="text-xs text-graphite/60 text-center tracking-widest uppercase">LUXE Beauty</p>
            </div>
          </div>
        </>,
        document.body
      )}
    </header>
  );
}