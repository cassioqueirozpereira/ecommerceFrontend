'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { registerUser } from '@/lib/api';
import { toast } from 'sonner';

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await registerUser({ firstName, lastName, email, password });
      toast.success('Conta criada com sucesso! Por favor, faça login.');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar conta.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-ivory text-obsidian py-12">
      <Container className="max-w-md w-full">
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl mb-2">Criar Conta</h1>
          <p className="text-graphite text-sm">Junte-se a nós para uma experiência de luxo.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-graphite mb-2" htmlFor="firstName">
                Nome
              </label>
              <input
                id="firstName"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-transparent border-b border-obsidian/20 px-0 py-3 text-obsidian focus:outline-none focus:border-obsidian transition-colors rounded-none"
                placeholder="Seu nome"
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-graphite mb-2" htmlFor="lastName">
                Sobrenome
              </label>
              <input
                id="lastName"
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-transparent border-b border-obsidian/20 px-0 py-3 text-obsidian focus:outline-none focus:border-obsidian transition-colors rounded-none"
                placeholder="Seu sobrenome"
              />
            </div>
          </div>

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
            {isLoading ? 'Criando...' : 'Criar Conta'}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-graphite">
          <p>
            Já tem uma conta?{' '}
            <Link href="/login" className="text-obsidian font-medium hover:underline border-b border-transparent hover:border-obsidian pb-0.5 transition-all">
              Entrar
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
}
