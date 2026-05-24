'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { ShoppingBag, X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { createOrder, getPaymentLink } from '@/lib/api';
import { Button } from '../ui/Button';

export function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, getCartTotal, clearCart } = useCartStore();
  const { token, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error('Faça login para finalizar a sua compra.');
      setIsOpen(false);
      router.push('/login');
      return;
    }

    if (!token) return;

    setIsCheckingOut(true);
    const toastId = toast.loading('Processando seu pedido...');

    try {
      // 1. Generate unique Idempotency Key
      const idempotencyKey = crypto.randomUUID();

      // 2. Prepare payload
      const orderItemsPayload = items.map((item) => ({
        productId: item.product.id,
        variantId: item.variant.id,
        quantity: item.quantity,
      }));

      const payload = {
        items: orderItemsPayload,
        paymentMethod: 'MERCADOPAGO',
      };

      // 3. Create Order
      const order = await createOrder(payload, token, idempotencyKey);
      
      toast.loading('Preparando link de pagamento...', { id: toastId });

      // 4. Retrieve payment link
      const paymentUrl = await getPaymentLink(order.id, token);

      toast.success('Pedido criado com sucesso! Redirecionando...', { id: toastId });
      
      // 5. Clear cart and redirect
      clearCart();
      setIsOpen(false);
      
      setTimeout(() => {
        window.location.href = paymentUrl;
      }, 500);

    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Falha ao processar checkout. Tente novamente.', { id: toastId });
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-obsidian/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={() => setIsOpen(false)}
      />
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-ivory shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out border-l border-graphite/10">
        <div className="flex items-center justify-between p-6 border-b border-graphite/10">
          <h2 className="text-xl font-serif text-obsidian tracking-tight">Seu Carrinho</h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 text-graphite hover:text-obsidian transition-colors rounded-full hover:bg-graphite/5"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <ShoppingBag size={48} className="text-graphite/30" />
              <p className="text-graphite">Seu carrinho está vazio.</p>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Continuar Comprando
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.variant.id} className="flex gap-4 items-start">
                <div className="h-24 w-24 bg-graphite/5 rounded-md overflow-hidden flex-shrink-0">
                  {item.product.images?.[0] && (
                    <img 
                      src={item.product.images[0]} 
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-obsidian text-sm leading-tight">
                      {item.product.name}
                    </h3>
                    <button 
                      onClick={() => removeItem(item.variant.id)}
                      className="text-graphite/50 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <p className="text-xs text-graphite">{item.variant.name}</p>
                  {/* Stock feedback */}
                  {item.variant.stock <= 5 && item.variant.stock > 0 ? (
                    <p className="text-xs text-amber-600 font-medium">{item.variant.stock} disponível</p>
                  ) : item.variant.stock <= 0 ? (
                    <p className="text-xs text-red-500 font-medium">Produto esgotado</p>
                  ) : (
                    <p className="text-xs text-graphite/50">{item.variant.stock} disponíveis</p>
                  )}
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex items-center border border-graphite/20 rounded-md">
                      <button 
                        className="px-2 py-1 text-graphite hover:text-obsidian disabled:opacity-30"
                        onClick={() => updateQuantity(item.variant.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-2 text-sm min-w-[2rem] text-center">{item.quantity}</span>
                      <button 
                        className="px-2 py-1 text-graphite hover:text-obsidian disabled:opacity-30"
                        onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                        disabled={item.quantity >= item.variant.stock}
                        title={item.quantity >= item.variant.stock ? `Máximo em estoque: ${item.variant.stock}` : ''}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="font-medium text-sm">
                      R${(item.variant.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-graphite/10 p-6 bg-ivory space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-graphite">Subtotal</span>
              <span className="font-medium text-obsidian">R${getCartTotal().toFixed(2)}</span>
            </div>
            <Button 
              size="full" 
              className="font-serif tracking-wide"
              onClick={handleCheckout}
              disabled={isCheckingOut}
            >
              {isCheckingOut ? 'Processando...' : 'Comprar'}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}