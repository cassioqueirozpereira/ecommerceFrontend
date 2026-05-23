import React from 'react';
import Link from 'next/link';
import { Container } from '../ui/Container';
import { NewsletterForm } from './NewsletterForm';

export function Footer() {
  return (
    <footer className="bg-obsidian text-ivory pt-16 pb-8 mt-auto">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <h2 className="font-serif text-2xl font-bold tracking-tighter mb-4">LUXE</h2>
            <p className="text-sm text-ivory/60 max-w-xs">
              Trazendo o auge do autocuidado e da beleza para a sua rotina. Eleve sua presença.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-4 text-sm tracking-widest uppercase">Loja</h3>
            <ul className="space-y-3">
              <li><Link href="/products" className="text-sm text-ivory/60 hover:text-ivory transition-colors">Novidades</Link></li>
              <li><Link href="/products?category=perfume" className="text-sm text-ivory/60 hover:text-ivory transition-colors">Perfumes</Link></li>
              <li><Link href="/products?category=cuidados-com-a-pele" className="text-sm text-ivory/60 hover:text-ivory transition-colors">Cuidados com a pele</Link></li>
              <li><Link href="/products?category=kits-e-presentes" className="text-sm text-ivory/60 hover:text-ivory transition-colors">Kits e Presentes</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4 text-sm tracking-widest uppercase">Suporte</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-ivory/60 hover:text-ivory transition-colors">FAQ</Link></li>
              <li><Link href="#" className="text-sm text-ivory/60 hover:text-ivory transition-colors">Envios e Devoluções</Link></li>
              <li><Link href="#" className="text-sm text-ivory/60 hover:text-ivory transition-colors">Contacte-nos</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4 text-sm tracking-widest uppercase">Novidades por email</h3>
            <p className="text-sm text-ivory/60 mb-4">Receba novidades e ofertas exclusivas.</p>
            <NewsletterForm />
          </div>
        </div>

        <div className="pt-8 border-t border-ivory/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-ivory/40">
            &copy; {new Date().getFullYear()} LUXE Beauty. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-xs text-ivory/40 hover:text-ivory transition-colors">Política de Privacidade</Link>
            <Link href="#" className="text-xs text-ivory/40 hover:text-ivory transition-colors">Termos de Serviço</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}