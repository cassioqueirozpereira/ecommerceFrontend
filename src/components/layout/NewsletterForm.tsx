'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { subscribeNewsletter } from '@/lib/api';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    try {
      const res = await subscribeNewsletter(email);
      toast.success(res.message || 'Inscrição realizada com sucesso!');
      setEmail('');
    } catch (error: any) {
      toast.error(error.message || 'Falha ao se inscrever. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email" 
        required
        className="bg-transparent border border-ivory/20 px-4 py-2 text-sm rounded-md w-full focus:outline-none focus:border-blush"
      />
      <button 
        type="submit" 
        disabled={isLoading}
        className="bg-ivory text-obsidian px-4 py-2 text-sm font-medium rounded-md hover:bg-ivory/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed min-w-[100px]"
      >
        {isLoading ? '...' : 'Subscribe'}
      </button>
    </form>
  );
}
