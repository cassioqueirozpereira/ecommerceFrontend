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
              Defining neo-premium beauty and luxury lifestyle since 2026. Elevate your presence.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-4 text-sm tracking-widest uppercase">Shop</h3>
            <ul className="space-y-3">
              <li><Link href="/products" className="text-sm text-ivory/60 hover:text-ivory transition-colors">All Products</Link></li>
              <li><Link href="/products?category=perfume" className="text-sm text-ivory/60 hover:text-ivory transition-colors">Perfume</Link></li>
              <li><Link href="/products?category=skincare" className="text-sm text-ivory/60 hover:text-ivory transition-colors">Skincare</Link></li>
              <li><Link href="/products?category=gifts" className="text-sm text-ivory/60 hover:text-ivory transition-colors">Gifts</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4 text-sm tracking-widest uppercase">Support</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-ivory/60 hover:text-ivory transition-colors">FAQ</Link></li>
              <li><Link href="#" className="text-sm text-ivory/60 hover:text-ivory transition-colors">Shipping & Returns</Link></li>
              <li><Link href="#" className="text-sm text-ivory/60 hover:text-ivory transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4 text-sm tracking-widest uppercase">Newsletter</h3>
            <p className="text-sm text-ivory/60 mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
            <NewsletterForm />
          </div>
        </div>

        <div className="pt-8 border-t border-ivory/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-ivory/40">
            &copy; {new Date().getFullYear()} LUXE Beauty. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-xs text-ivory/40 hover:text-ivory transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-xs text-ivory/40 hover:text-ivory transition-colors">Terms of Service</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}