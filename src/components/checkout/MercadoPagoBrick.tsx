'use client';

import React, { useEffect, useState } from 'react';
import { initMercadoPago, Payment } from '@mercadopago/sdk-react';

interface MercadoPagoBrickProps {
  amount: number;
  onSubmit: (paymentData: any) => Promise<void>;
  onError: (error: any) => void;
}

export function MercadoPagoBrick({ amount, onSubmit, onError }: MercadoPagoBrickProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY;
    if (publicKey) {
      initMercadoPago(publicKey, { locale: 'pt-BR' });
      setIsReady(true);
    } else {
      console.error('Mercado Pago public key not found');
      onError(new Error('Chave pública do Mercado Pago não configurada'));
    }
  }, [onError]);

  if (!isReady) {
    return <div className="p-8 text-center text-graphite animate-pulse">Carregando módulo de pagamento...</div>;
  }

  const initialization = {
    amount: amount,
  };

  const customization = {
    paymentMethods: {
      creditCard: 'all' as const,
      debitCard: 'all' as const,
      maxInstallments: 12,
    },
    visual: {
      style: {
        theme: 'default' as const,
      },
    },
  };

  return (
    <div className="w-full">
      <Payment
        initialization={initialization}
        customization={customization}
        onSubmit={async (param: any) => {
          try {
            // The Brick wraps the real data inside `formData`
            const formData = param?.formData ?? param;
            console.log('[MP Brick] onSubmit raw param:', JSON.stringify(param));
            await onSubmit(formData);
          } catch (error) {
            onError(error);
          }
        }}
        onError={(error) => {
          console.error('Payment Brick error:', error);
          onError(error);
        }}
        onReady={() => {
          console.log('Payment Brick ready');
        }}
      />
    </div>
  );
}
