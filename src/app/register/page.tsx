'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { FormField } from '@/components/ui/FormField';
import { LoadingButton } from '@/components/ui/LoadingButton';
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
            <FormField
              id="firstName"
              label="Nome"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Seu nome"
              required
            />
            <FormField
              id="lastName"
              label="Sobrenome"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Seu sobrenome"
              required
            />
          </div>

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
            loadingText="Criando..."
          >
            Criar Conta
          </LoadingButton>
        </form>

        <div className="mt-8 text-center text-sm text-graphite">
          <p>
            Já tem uma conta?{' '}
            <Link
              href="/login"
              className="text-obsidian font-medium hover:underline border-b border-transparent hover:border-obsidian pb-0.5 transition-all"
            >
              Entrar
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
}
