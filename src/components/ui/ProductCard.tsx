'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { Product } from '@/types';
import { Skeleton } from './Skeleton';
import { useAuthStore } from '@/store/authStore';
import { deleteProduct } from '@/lib/api';
import { toast } from 'sonner';

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
  /** Currency symbol prefix. @default "R$" */
  currency?: string;
}

const hoverScaleClasses: Record<string, string> = {
  '105': 'group-hover:scale-105',
  '110': 'group-hover:scale-110',
  '125': 'group-hover:scale-125',
  '150': 'group-hover:scale-150',
  '175': 'group-hover:scale-[1.75]',
  '[1.75]': 'group-hover:scale-[1.75]',
  '200': 'group-hover:scale-200',
};

/**
 * Premium product card with zoom-on-hover image effect.
 * Used on the home page (Destaques) and the products grid.
 */
export function ProductCard({
  product,
  hoverScale = '150',
  showCategory = true,
  showPrice = true,
  currency = 'R$',
}: ProductCardProps) {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';

  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // A product is out of stock if it has variants and ALL of them have stock <= 0
  const isOutOfStock = product.variants && product.variants.length > 0 && product.variants.every((v) => v.stock <= 0);

  const scaleClass = hoverScaleClasses[hoverScale] || 'group-hover:scale-150';
  const appliedScaleClass = isOutOfStock ? '' : scaleClass;

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!token) return;

    if (!isConfirmingDelete) {
      setIsConfirmingDelete(true);
      return;
    }

    try {
      setIsDeleting(true);
      await deleteProduct(product.id, token);
      toast.success('Produto excluído com sucesso');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao excluir produto');
      setIsConfirmingDelete(false);
      setIsDeleting(false);
    }
  };

  const cancelDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsConfirmingDelete(false);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/admin/edit/${product.slug}`);
  };

  return (
    <Link href={`/product/${product.slug}`} className="group flex flex-col relative">
      {/* Admin Quick Actions */}
      {isAdmin && (
        <div className="absolute top-2 right-2 z-20 flex flex-col gap-2">
          {isConfirmingDelete ? (
            <div className="flex flex-col gap-1 bg-white p-1.5 rounded-md shadow-lg border border-red-200" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
              <span className="text-[10px] font-bold text-center text-red-600 mb-1">Confirmar?</span>
              <div className="flex gap-1">
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="p-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 flex-1 flex justify-center"
                  title="Sim"
                >
                  <Check size={14} />
                </button>
                <button
                  onClick={cancelDelete}
                  disabled={isDeleting}
                  className="p-1.5 bg-gray-200 text-graphite rounded hover:bg-gray-300 transition-colors flex-1 flex justify-center"
                  title="Cancelar"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ) : (
            <>
              <button
                onClick={handleEdit}
                className="p-2 bg-white/90 backdrop-blur-sm text-graphite rounded-full shadow-sm hover:bg-white hover:text-obsidian hover:shadow-md transition-all"
                title="Editar Produto"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 bg-white/90 backdrop-blur-sm text-graphite rounded-full shadow-sm hover:bg-red-50 hover:text-red-600 hover:shadow-md transition-all"
                title="Excluir Produto"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      )}

      {/* Image container */}
      <div className="aspect-[4/5] bg-graphite/5 rounded-md overflow-hidden mb-4 relative">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-700 ${appliedScaleClass}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-graphite/30 bg-graphite/5 text-sm">
            Sem imagem
          </div>
        )}
        {/* Subtle dark overlay on hover if in stock */}
        {!isOutOfStock && <div className="absolute inset-0 bg-obsidian/0 group-hover:bg-obsidian/5 transition-colors duration-300" />}

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-obsidian/40 backdrop-blur-[2px] flex items-center justify-center z-10 transition-colors duration-300">
            <span className="text-white text-xs font-bold tracking-[0.25em] px-4 py-2 border border-white/40 rounded bg-white/10 backdrop-blur-md uppercase">
              Esgotado
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className={`flex justify-between items-start gap-4 ${isOutOfStock ? 'opacity-60 grayscale-[30%]' : ''}`}>
        <div>
          <h3 className="font-medium text-lg leading-tight group-hover:text-blush transition-colors">
            {product.name}
          </h3>
          {showCategory && (
            <p className="text-sm text-graphite mt-1">
              {product.category?.name || 'Skincare'}
            </p>
          )}
        </div>
        {showPrice && (
          <div className="flex flex-col items-end">
            {product.promotionalPrice ? (
              <span className="text-xs text-graphite/60 line-through mb-[-2px]">
                {currency}{product.basePrice.toFixed(2)}
              </span>
            ) : null}
            <p className="font-serif flex-shrink-0 flex items-center gap-1.5 mt-0.5">
              <span>{currency}{(product.promotionalPrice || product.basePrice).toFixed(2)}</span>
              {!isOutOfStock && (
                <span className="text-[10px] font-sans tracking-wider font-bold text-emerald-600 uppercase bg-emerald-50 px-1.5 py-0.5 rounded-sm">
                  no pix
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}

/**
 * Skeleton loader that matches the ProductCard layout.
 */
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col">
      <Skeleton className="aspect-[4/5] mb-4 w-full" />
      <div className="flex justify-between items-start gap-4">
        <div className="w-full">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-6 w-1/4" />
      </div>
    </div>
  );
}
