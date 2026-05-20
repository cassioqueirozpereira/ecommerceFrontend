'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { loginUser } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await loginUser({ email, password });
      // Depending on backend response structure:
      // Assuming res.token and res.user (or decoding JWT if needed)
      login(res.user || { email, id: 'temp', firstName: '', lastName: '' }, res.accessToken || res.token);
      toast.success('Bem-vindo de volta!');
      router.push('/');
    } catch (error: any) {
      toast.error(error.message || 'Credenciais inválidas.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-ivory text-obsidian py-12">
      <Container className="max-w-md w-full">
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl mb-2">Entrar</h1>
          <p className="text-graphite text-sm">Acesse sua conta para uma experiência exclusiva.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-medium uppercase tracking-widest text-graphite mb-2" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-obsidian/20 px-0 py-3 text-obsidian focus:outline-none focus:border-obsidian transition-colors rounded-none"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-widest text-graphite mb-2" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-obsidian/20 px-0 py-3 text-obsidian focus:outline-none focus:border-obsidian transition-colors rounded-none"
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" size="full" className="mt-8" disabled={isLoading}>
            {isLoading ? 'Autenticando...' : 'Entrar'}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-graphite">
          <p>
            Ainda não tem uma conta?{' '}
            <Link href="/register" className="text-obsidian font-medium hover:underline border-b border-transparent hover:border-obsidian pb-0.5 transition-all">
              Criar conta
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
}
