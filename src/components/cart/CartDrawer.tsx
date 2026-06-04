'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { ShoppingBag, X, Minus, Plus, Trash2, CreditCard, QrCode, Upload, Loader2 } from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { createOrder, getPaymentLink, submitPixOrder, getCloudinarySignature } from '@/lib/api';
import { Button } from '../ui/Button';

type PaymentStep = 'cart' | 'payment-method' | 'pix-form';
type PaymentMethod = 'MERCADO_PAGO_CARD' | 'PIX_MANUAL';

function formatCpf(value: string) {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .slice(0, 14);
}

function formatPhone(value: string) {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 15);
}

export function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, getCartTotal, clearCart } = useCartStore();
  const { token, isAuthenticated } = useAuthStore();
  const router = useRouter();

  const [step, setStep] = useState<PaymentStep>('cart');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [payerName, setPayerName] = useState('');
  const [payerCpf, setPayerCpf] = useState('');
  const [payerPhone, setPayerPhone] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setStep('cart');
    setPayerName('');
    setPayerCpf('');
    setPayerPhone('');
    setReceiptFile(null);
    setReceiptPreview(null);
  };

  const handleClose = () => {
    setIsOpen(false);
    resetState();
  };

  const requireAuth = () => {
    if (!isAuthenticated) {
      toast.error('Faça login para finalizar a sua compra.');
      handleClose();
      router.push('/login');
      return false;
    }
    return true;
  };

  const handleSelectMethod = (method: PaymentMethod) => {
    if (!requireAuth()) return;
    if (method === 'MERCADO_PAGO_CARD') {
      handleCardCheckout();
    } else {
      setStep('pix-form');
    }
  };

  const handleCardCheckout = async () => {
    if (!token) return;
    setIsCheckingOut(true);
    const toastId = toast.loading('Processando seu pedido...');
    try {
      const idempotencyKey = crypto.randomUUID();
      const payload = {
        items: items.map((item) => ({
          productId: item.product.id,
          variantId: item.variant.id,
          quantity: item.quantity,
        })),
        paymentMethod: 'MERCADO_PAGO_CARD',
      };

      const order = await createOrder(payload, token, idempotencyKey);
      toast.loading('Preparando link de pagamento...', { id: toastId });
      const paymentUrl = await getPaymentLink(order.id, token);
      toast.success('Pedido criado! Redirecionando...', { id: toastId });
      clearCart();
      handleClose();
      setTimeout(() => { window.location.href = paymentUrl; }, 500);
    } catch (err: any) {
      toast.error(err.message || 'Falha ao processar checkout.', { id: toastId });
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReceiptFile(file);
    setReceiptPreview(URL.createObjectURL(file));
  };

  const uploadReceipt = async (): Promise<string> => {
    if (!token || !receiptFile) throw new Error('Comprovante não selecionado');
    setIsUploading(true);
    try {
      const sig = await getCloudinarySignature(token, 'ecommerce/receipts');
      const formData = new FormData();
      formData.append('file', receiptFile);
      formData.append('api_key', sig.apiKey);
      formData.append('timestamp', sig.timestamp);
      formData.append('signature', sig.signature);
      formData.append('folder', sig.folder);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
        { method: 'POST', body: formData }
      );
      if (!uploadRes.ok) throw new Error('Falha no upload do comprovante');
      const uploadData = await uploadRes.json();
      return uploadData.secure_url as string;
    } finally {
      setIsUploading(false);
    }
  };

  const handlePixSubmit = async () => {
    if (!token) return;
    if (!payerName.trim() || !payerCpf.trim() || !payerPhone.trim()) {
      toast.error('Preencha todos os campos obrigatórios.');
      return;
    }
    if (!receiptFile) {
      toast.error('Anexe o comprovante de pagamento.');
      return;
    }

    setIsCheckingOut(true);
    const toastId = toast.loading('Enviando comprovante...');
    try {
      const pixReceiptUrl = await uploadReceipt();
      toast.loading('Registrando pedido...', { id: toastId });

      const idempotencyKey = crypto.randomUUID();
      await submitPixOrder(
        {
          items: items.map((item) => ({
            productId: item.product.id,
            variantId: item.variant.id,
            quantity: item.quantity,
          })),
          paymentMethod: 'PIX_MANUAL',
          payerName: payerName.trim(),
          payerCpf: payerCpf.replace(/\D/g, ''),
          payerPhone: payerPhone.replace(/\D/g, ''),
          pixReceiptUrl,
        },
        token,
        idempotencyKey
      );

      toast.success('Pedido enviado! Aguarde a confirmação.', { id: toastId });
      clearCart();
      handleClose();
    } catch (err: any) {
      toast.error(err.message || 'Falha ao registrar pedido Pix.', { id: toastId });
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-obsidian/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={handleClose}
      />
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-ivory shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out border-l border-graphite/10">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-graphite/10">
          {step !== 'cart' && (
            <button
              onClick={() => setStep(step === 'pix-form' ? 'payment-method' : 'cart')}
              className="text-sm text-graphite hover:text-obsidian transition-colors mr-3"
            >
              ← Voltar
            </button>
          )}
          <h2 className="text-xl font-serif text-obsidian tracking-tight flex-1">
            {step === 'cart' && 'Seu Carrinho'}
            {step === 'payment-method' && 'Forma de Pagamento'}
            {step === 'pix-form' && 'Pagamento via Pix'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 text-graphite hover:text-obsidian transition-colors rounded-full hover:bg-graphite/5"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── STEP: CART ── */}
        {step === 'cart' && (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <ShoppingBag size={48} className="text-graphite/30" />
                  <p className="text-graphite">Seu carrinho está vazio.</p>
                  <Button variant="outline" onClick={handleClose}>Continuar Comprando</Button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.variant.id} className="flex gap-4 items-start">
                    <div className="h-24 w-24 bg-graphite/5 rounded-md overflow-hidden flex-shrink-0">
                      {item.product.images?.[0] && (
                        <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 flex flex-col gap-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-obsidian text-sm leading-tight">{item.product.name}</h3>
                        <button onClick={() => removeItem(item.variant.id)} className="text-graphite/50 hover:text-red-500 transition-colors p-1">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p className="text-xs text-graphite">{item.variant.name}</p>
                      {item.variant.stock <= 5 && item.variant.stock > 0 ? (
                        <p className="text-xs text-amber-600 font-medium">{item.variant.stock} disponível</p>
                      ) : item.variant.stock <= 0 ? (
                        <p className="text-xs text-red-500 font-medium">Produto esgotado</p>
                      ) : (
                        <p className="text-xs text-graphite/50">{item.variant.stock} disponíveis</p>
                      )}
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center border border-graphite/20 rounded-md">
                          <button className="px-2 py-1 text-graphite hover:text-obsidian disabled:opacity-30" onClick={() => updateQuantity(item.variant.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                            <Minus size={14} />
                          </button>
                          <span className="px-2 text-sm min-w-[2rem] text-center">{item.quantity}</span>
                          <button className="px-2 py-1 text-graphite hover:text-obsidian disabled:opacity-30" onClick={() => updateQuantity(item.variant.id, item.quantity + 1)} disabled={item.quantity >= item.variant.stock}>
                            <Plus size={14} />
                          </button>
                        </div>
                        <span className="font-medium text-sm">R${(item.variant.price * item.quantity).toFixed(2)}</span>
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
                <Button size="full" className="font-serif tracking-wide" onClick={() => { if (requireAuth()) setStep('payment-method'); }}>
                  Escolher Pagamento
                </Button>
              </div>
            )}
          </>
        )}

        {/* ── STEP: PAYMENT METHOD ── */}
        {step === 'payment-method' && (
          <div className="flex-1 p-6 flex flex-col gap-4">
            <p className="text-sm text-graphite">Selecione como deseja pagar:</p>

            <button
              onClick={() => handleSelectMethod('MERCADO_PAGO_CARD')}
              disabled={isCheckingOut}
              className="flex items-center gap-4 p-5 border-2 border-graphite/15 rounded-xl hover:border-obsidian hover:bg-obsidian/5 transition-all text-left group"
            >
              <div className="p-3 bg-obsidian/5 rounded-lg group-hover:bg-obsidian/10 transition-colors">
                <CreditCard size={24} className="text-obsidian" />
              </div>
              <div>
                <p className="font-semibold text-obsidian text-sm">Cartão de Crédito</p>
                <p className="text-xs text-graphite mt-0.5">Pague com segurança via Mercado Pago</p>
              </div>
            </button>

            <button
              onClick={() => handleSelectMethod('PIX_MANUAL')}
              disabled={isCheckingOut}
              className="flex items-center gap-4 p-5 border-2 border-graphite/15 rounded-xl hover:border-emerald-600 hover:bg-emerald-50 transition-all text-left group"
            >
              <div className="p-3 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
                <QrCode size={24} className="text-emerald-700" />
              </div>
              <div>
                <p className="font-semibold text-obsidian text-sm">Pix Manual</p>
                <p className="text-xs text-graphite mt-0.5">Zero taxas · Aprovação em minutos</p>
              </div>
            </button>

            <div className="mt-auto p-4 bg-amber-50 rounded-xl border border-amber-200">
              <p className="text-xs text-amber-800 font-medium">Chave Pix da loja:</p>
              <p className="text-sm font-mono text-amber-900 mt-1 select-all">41988171218</p>
              <p className="text-xs text-amber-700 mt-1">Total: <strong>R${getCartTotal().toFixed(2)}</strong></p>
            </div>
          </div>
        )}

        {/* ── STEP: PIX FORM ── */}
        {step === 'pix-form' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            <p className="text-sm text-graphite">
              Após realizar o Pix, preencha os dados e anexe o comprovante:
            </p>

            {/* Payer Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-obsidian uppercase tracking-wide">Nome completo do titular *</label>
              <input
                type="text"
                value={payerName}
                onChange={(e) => setPayerName(e.target.value)}
                placeholder="Nome como no banco"
                className="w-full px-4 py-3 border border-graphite/20 rounded-lg text-sm focus:outline-none focus:border-obsidian transition-colors bg-white"
              />
            </div>

            {/* CPF */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-obsidian uppercase tracking-wide">CPF *</label>
              <input
                type="text"
                value={payerCpf}
                onChange={(e) => setPayerCpf(formatCpf(e.target.value))}
                placeholder="000.000.000-00"
                className="w-full px-4 py-3 border border-graphite/20 rounded-lg text-sm focus:outline-none focus:border-obsidian transition-colors bg-white"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-obsidian uppercase tracking-wide">Telefone de contato *</label>
              <input
                type="text"
                value={payerPhone}
                onChange={(e) => setPayerPhone(formatPhone(e.target.value))}
                placeholder="(11) 99999-9999"
                className="w-full px-4 py-3 border border-graphite/20 rounded-lg text-sm focus:outline-none focus:border-obsidian transition-colors bg-white"
              />
            </div>

            {/* Receipt Upload */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-obsidian uppercase tracking-wide">Comprovante de pagamento *</label>
              <input ref={fileInputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileChange} />

              {receiptPreview ? (
                <div className="relative rounded-lg overflow-hidden border border-graphite/20">
                  <img src={receiptPreview} alt="Comprovante" className="w-full max-h-48 object-contain bg-graphite/5" />
                  <button
                    onClick={() => { setReceiptFile(null); setReceiptPreview(null); }}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow text-graphite hover:text-red-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex flex-col items-center justify-center gap-2 py-8 border-2 border-dashed border-graphite/20 rounded-lg hover:border-obsidian hover:bg-obsidian/5 transition-all"
                >
                  <Upload size={20} className="text-graphite" />
                  <span className="text-sm text-graphite">Clique para anexar</span>
                  <span className="text-xs text-graphite/60">JPG, PNG ou PDF</span>
                </button>
              )}
            </div>

            <Button
              size="full"
              className="font-serif tracking-wide mt-2"
              onClick={handlePixSubmit}
              disabled={isCheckingOut || isUploading}
            >
              {isCheckingOut || isUploading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  {isUploading ? 'Enviando comprovante...' : 'Registrando pedido...'}
                </span>
              ) : 'Confirmar Pedido Pix'}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}