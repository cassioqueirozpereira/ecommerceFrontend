'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      document.body.style.overflow = 'hidden';
      // Slight delay to allow CSS transitions and rendering
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
      setTimeout(() => {
        setIsMounted(false);
        setQuery('');
      }, 200); // Wait for fade-out transition
    }

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    router.push(`/products?q=${encodeURIComponent(query)}`);
    onClose();
  };

  if (typeof window === 'undefined') return null;
  if (!isOpen && !isMounted) return null;

  return createPortal(
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center pt-20 bg-obsidian/80 backdrop-blur-md transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* Overlay to catch clicks outside */}
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className={`relative w-full max-w-2xl px-4 transition-transform duration-300 ease-out ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
        <form onSubmit={handleSubmit} className="relative flex items-center w-full group">
          <Search className="absolute left-8 text-ivory/50 transition-colors group-focus-within:text-champagne" size={24} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="O que você está procurando?"
            className="w-full bg-obsidian border border-ivory/20 rounded-[2rem] py-4 pl-16 pr-16 text-lg text-ivory placeholder-ivory/50 focus:outline-none focus:border-champagne shadow-2xl transition-all"
          />
          <button 
            type="button"
            onClick={onClose}
            className="absolute right-8 text-ivory/50 hover:text-ivory transition-colors"
          >
            <X size={24} />
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
