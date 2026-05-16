'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400">
          Lumina
        </Link>

        <nav className="hidden md:flex gap-6">
          <Link href="/products" className="text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors">Catálogo</Link>
          {user?.role === 'ROLE_ADMIN' && (
            <Link href="/admin" className="text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors">Admin</Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors">
            <ShoppingCartIcon className="w-6 h-6" />
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm hidden sm:block text-gray-600 dark:text-gray-300">Olá, {user.name}</span>
              <button onClick={logout} className="text-sm text-red-500 hover:text-red-600">Sair</button>
            </div>
          ) : (
            <Link href="/login" className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors">
              <UserIcon className="w-6 h-6" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}