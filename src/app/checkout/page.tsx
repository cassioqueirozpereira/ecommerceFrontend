'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { createOrder } from '@/lib/api';
import { MercadoPagoBrick } from '@/components/checkout/MercadoPagoBrick';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getCartTotal, clearCart } = useCartStore();
  const { token, isAuthenticated } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Faça login para continuar');
      router.push('/login');
    } else if (items.length === 0) {
      router.push('/');
    }
  }, [isAuthenticated, items, router]);

  if (!isAuthenticated || items.length === 0) {
    return null;
  }

  const handlePaymentSubmit = async (paymentData: any) => {
    if (!token) {
      toast.error('Erro de autenticação. Faça login novamente.');
      return;
    }

    setIsProcessing(true);
    const toastId = toast.loading('Processando seu pagamento...');

    try {
      const idempotencyKey = crypto.randomUUID();
      
      const payload = {
        items: items.map((item) => ({
          productId: item.product.id,
          variantId: item.variant.id,
          quantity: item.quantity,
        })),
        paymentMethod: 'MERCADO_PAGO_CARD',
        cardPayment: {
          token: paymentData.token,
          installments: paymentData.installments,
          issuerId: paymentData.issuer_id,
          paymentMethodId: paymentData.payment_method_id,
          payer: {
            email: paymentData.payer.email,
            identification: {
              type: paymentData.payer.identification.type,
              number: paymentData.payer.identification.number,
            }
          }
        }
      };

      await createOrder(payload, token, idempotencyKey);
      
      toast.success('Pagamento aprovado! Seu pedido foi confirmado.', { id: toastId });
      clearCart();
      router.push('/profile/orders'); // Assuming there's an orders page or just redirect to home
      
    } catch (error: any) {
      toast.error(error.message || 'Falha ao processar o pagamento.', { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentError = (error: any) => {
    if (!isProcessing) {
      toast.error('Ocorreu um erro ao carregar o pagamento.');
    }
  };

  return (
    <div className="min-h-screen bg-ivory pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Formulário de Pagamento */}
        <div className="lg:col-span-7 space-y-6">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-graphite hover:text-obsidian transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            Voltar
          </button>

          <h1 className="text-3xl font-serif text-obsidian tracking-tight">Finalizar Compra</h1>
          <p className="text-graphite text-sm">Insira os dados do seu cartão para concluir o pedido de forma segura.</p>

          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-graphite/10 relative">
            {isProcessing && (
              <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl">
                <Loader2 size={32} className="animate-spin text-obsidian mb-4" />
                <p className="font-medium text-obsidian">Processando pagamento...</p>
                <p className="text-sm text-graphite mt-1">Por favor, não feche a página.</p>
              </div>
            )}
            <MercadoPagoBrick 
              amount={getCartTotal()} 
              onSubmit={handlePaymentSubmit}
              onError={handlePaymentError}
            />
          </div>
        </div>

        {/* Resumo do Pedido */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-graphite/10 sticky top-24">
            <h2 className="text-xl font-serif text-obsidian mb-6 flex items-center gap-2">
              <ShoppingBag size={20} />
              Resumo do Pedido
            </h2>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 mb-6">
              {items.map((item) => (
                <div key={item.variant.id} className="flex gap-4">
                  <div className="w-16 h-16 bg-graphite/5 rounded-md overflow-hidden flex-shrink-0">
                    {item.product.images?.[0] && (
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-obsidian leading-tight">{item.product.name}</h3>
                    <p className="text-xs text-graphite mt-1">{item.variant.name}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-graphite">Qtd: {item.quantity}</span>
                      <span className="text-sm font-medium">R$ {(item.variant.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-graphite/10 pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-graphite">Subtotal</span>
                <span>R$ {getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-graphite">Frete</span>
                <span className="text-emerald-600 font-medium">Grátis</span>
              </div>
              <div className="flex justify-between text-lg font-medium pt-2 border-t border-graphite/10">
                <span className="text-obsidian">Total</span>
                <span className="text-obsidian">R$ {getCartTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
