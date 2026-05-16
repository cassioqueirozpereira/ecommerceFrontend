'use client';

import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';
import { useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cart, removeFromCart, total, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/cart');
      return;
    }

    setLoading(true);
    try {
      // 1. Create Order
      const items = cart.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity
      }));
      
      const orderRes = await api.post('/orders', { items });
      const orderId = orderRes.data.id;

      // 2. Create Payment Preference
      const prefRes = await api.post(`/payments/preference/${orderId}`);
      const checkoutUrl = prefRes.data;

      // 3. Clear cart and redirect to Mercado Pago
      clearCart();
      window.location.href = checkoutUrl;

    } catch (error) {
      console.error('Checkout error:', error);
      alert('Ocorreu um erro ao processar seu pedido.');
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Seu carrinho está vazio</h1>
        <Link href="/products" className="text-primary-500 hover:text-primary-600 font-medium text-lg">
          Continuar comprando
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Carrinho de Compras</h1>
      
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-800">
        <ul className="divide-y divide-gray-200 dark:divide-gray-800 mb-8">
          {cart.map((item) => (
            <li key={item.variantId} className="py-6 flex flex-col sm:flex-row gap-6 items-center">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden shrink-0">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.productTitle} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Sem imagem</div>
                )}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.productTitle}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">SKU: {item.sku}</p>
                <div className="mt-2 text-gray-900 dark:text-gray-300">Qtd: {item.quantity}</div>
              </div>
              <div className="text-xl font-medium text-gray-900 dark:text-white">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price * item.quantity)}
              </div>
              <button 
                onClick={() => removeFromCart(item.variantId)}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <TrashIcon className="w-6 h-6" />
              </button>
            </li>
          ))}
        </ul>

        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-0">
            Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
          </div>
          
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full sm:w-auto px-8 py-4 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-xl font-bold text-lg transition-colors"
          >
            {loading ? 'Processando...' : 'Finalizar Compra'}
          </button>
        </div>
      </div>
    </div>
  );
}