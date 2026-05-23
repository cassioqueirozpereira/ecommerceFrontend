'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { FormField } from '@/components/ui/FormField';
import { LoadingButton } from '@/components/ui/LoadingButton';
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
          <FormField
            id="email"
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
          />
          <FormField
            id="password"
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <LoadingButton
            type="submit"
            size="full"
            className="mt-8"
            isLoading={isLoading}
            loadingText="Autenticando..."
          >
            Entrar
          </LoadingButton>
        </form>

        <div className="mt-8 text-center text-sm text-graphite">
          <p>
            Ainda não tem uma conta?{' '}
            <Link
              href="/register"
              className="text-obsidian font-medium hover:underline border-b border-transparent hover:border-obsidian pb-0.5 transition-all"
            >
              Criar conta
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
}
