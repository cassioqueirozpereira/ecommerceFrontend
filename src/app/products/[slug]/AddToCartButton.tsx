'use client';

import { Product, Variant } from '@/types';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    product.variants.length > 0 ? product.variants[0] : null
  );

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    addToCart({
      variantId: selectedVariant.id,
      productTitle: product.title,
      sku: selectedVariant.sku,
      price: selectedVariant.price,
      quantity: 1,
      imageUrl: product.imageUrl,
    });
    
    alert('Produto adicionado ao carrinho!');
  };

  if (product.variants.length === 0) {
    return <div className="text-red-500">Produto indisponível no momento.</div>;
  }

  return (
    <div>
      {/* Variant Selection UI could be expanded here based on attributes */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Variação
        </label>
        <select 
          className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
          value={selectedVariant?.id || ''}
          onChange={(e) => {
            const v = product.variants.find(v => v.id === e.target.value);
            if (v) setSelectedVariant(v);
          }}
        >
          {product.variants.map((variant) => (
            <option key={variant.id} value={variant.id}>
              {variant.sku} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(variant.price)}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={!selectedVariant || selectedVariant.stockQuantity <= 0}
        className="w-full py-4 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-xl font-bold text-lg transition-colors"
      >
        {selectedVariant?.stockQuantity && selectedVariant.stockQuantity > 0 
          ? 'Adicionar ao Carrinho' 
          : 'Esgotado'}
      </button>
    </div>
  );
}