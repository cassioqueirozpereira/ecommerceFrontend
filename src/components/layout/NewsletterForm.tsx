'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    // Simular uma requisição (API)
    await new Promise((resolve) => setTimeout(resolve, 800));

    setIsLoading(false);
    toast.success('Inscrição realizada com sucesso!');
    setEmail('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email" 
        required
        className="bg-transparent border border-ivory/20 px-4 py-2 text-sm rounded-md w-full focus:outline-none focus:border-champagne"
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
