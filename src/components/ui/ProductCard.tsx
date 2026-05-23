import React from 'react';
import Link from 'next/link';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  /** Tailwind scale value on hover. Use bracket notation for arbitrary values.
   *  @example "125" → scale-125 | "[1.75]" → scale-[1.75]
   *  @default "125"
   */
  hoverScale?: string;
  /** Show category label below the product name. @default true */
  showCategory?: boolean;
  /** Show the price. @default true */
  showPrice?: boolean;
  /** Currency symbol prefix. @default "$" */
  currency?: string;
}

/**
 * Premium product card with zoom-on-hover image effect.
 * Used on the home page (Destaques) and the products grid.
 */
export function ProductCard({
  product,
  hoverScale = '125',
  showCategory = true,
  showPrice = true,
  currency = '$',
}: ProductCardProps) {
  const scaleClass = `group-hover:scale-${hoverScale}`;

  return (
    <Link href={`/product/${product.slug}`} className="group flex flex-col">
      {/* Image container */}
      <div className="aspect-[4/5] bg-graphite/5 rounded-md overflow-hidden mb-4 relative">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-700 ${scaleClass}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-graphite/30 bg-graphite/5 text-sm">
            Sem imagem
          </div>
        )}
        {/* Subtle dark overlay on hover */}
        <div className="absolute inset-0 bg-obsidian/0 group-hover:bg-obsidian/5 transition-colors duration-300" />
      </div>

      {/* Info */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="font-medium text-lg leading-tight group-hover:text-champagne transition-colors">
            {product.name}
          </h3>
          {showCategory && (
            <p className="text-sm text-graphite mt-1">
              {product.category?.name || 'Skincare'}
            </p>
          )}
        </div>
        {showPrice && (
          <p className="font-serif flex-shrink-0">
            {currency}{product.basePrice.toFixed(2)}
          </p>
        )}
      </div>
    </Link>
  );
}
