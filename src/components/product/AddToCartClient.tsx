'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { Product, Variant } from '@/types';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/lib/store/cartStore';

interface Props {
  product: Product;
}

export function AddToCartClient({ product }: Props) {
  const [selectedVariant, setSelectedVariant] = useState<Variant>(
    product.variants?.[0] || null
  );
  const addItem = useCartStore((state) => state.addItem);

  const hasVariants = product.variants && product.variants.length > 1;
  const isOutOfStock = !selectedVariant || selectedVariant.stock <= 0;

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    const result = addItem(product, selectedVariant, 1);
    if (!result.success && result.message) {
      toast.error(result.message);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Price & Installments */}
      <div>
        <p className="text-3xl font-serif tracking-tight text-obsidian">
          R${selectedVariant ? selectedVariant.price.toFixed(2) : product.basePrice.toFixed(2)}
        </p>
        <p className="text-sm text-graphite mt-1">
          Ou em até 10x de R${((selectedVariant?.price || product.basePrice) / 10).toFixed(2)} sem juros
        </p>
      </div>

      {/* Stock indicator */}
      {selectedVariant && selectedVariant.stock > 0 && selectedVariant.stock <= 5 && (
        <p className="text-xs font-medium text-amber-600">
          {selectedVariant.stock} disponível
        </p>
      )}

      {/* CTA */}
      <Button
        size="lg"
        className="w-full font-serif tracking-wide text-lg"
        onClick={handleAddToCart}
        disabled={isOutOfStock}
      >
        {isOutOfStock ? 'Esgotado' : 'Adicionar à Sacola'}
      </Button>

      {/* Variants Selection */}
      {hasVariants && (
        <div className="pt-6 border-t border-graphite/10">
          <h3 className="text-sm font-medium uppercase tracking-widest mb-3 text-graphite">
            Selecione a Variação
          </h3>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => setSelectedVariant(variant)}
                disabled={variant.stock <= 0}
                className={`px-4 py-2 text-sm border rounded-md transition-colors ${
                  variant.stock <= 0
                    ? 'border-graphite/10 text-graphite/30 cursor-not-allowed line-through'
                    : selectedVariant?.id === variant.id
                    ? 'border-obsidian bg-obsidian text-ivory'
                    : 'border-graphite/20 text-obsidian hover:border-graphite/50'
                }`}
              >
                {variant.name}
                {variant.stock <= 0 && ' (Esgotado)'}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
