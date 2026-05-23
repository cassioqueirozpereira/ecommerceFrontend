import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { ProductCard } from '@/components/ui/ProductCard';
import { getProducts } from '@/lib/api';
import { buildCategoryUrl, buildSortUrl, FILTER_CATEGORIES } from '@/lib/productUtils';

export const metadata = {
  title: 'Coleção | Luxe Beauty',
  description: 'Explore nossa coleção premium de produtos de beleza e perfumaria.',
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; sort?: string };
}) {
  const { category, sort } = searchParams;
  
  // Fetch from server using SSR with query params
  const products = await getProducts(category, sort);

  return (
    <div className="min-h-screen bg-ivory text-obsidian pb-24">
      {/* Category Header */}
      <div className="bg-obsidian text-ivory py-16 md:py-24 text-center">
        <Container>
          <h1 className="text-4xl md:text-6xl font-serif tracking-tighter mb-4 capitalize">
            {category || 'Toda a Coleção'}
          </h1>
          <p className="text-ivory/70 max-w-2xl mx-auto font-light">
            Descubra o auge da qualidade e sofisticação. Nossa seleção curada representa a melhor perfumaria e cuidados para a pele.
          </p>
        </Container>
      </div>

      <Container className="mt-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar / Filters (SSR Driven) */}
          <aside className="w-full md:w-64 flex-shrink-0 space-y-8">
            <div>
              <h3 className="font-medium tracking-widest text-sm uppercase mb-4 text-graphite">Categorias</h3>
              <ul className="space-y-3 text-sm">
                {FILTER_CATEGORIES.map((cat) => (
                  <li key={cat.slug || 'all'}>
                    <Link 
                      href={buildCategoryUrl(cat.slug, sort)}
                      className={`${
                        (cat.slug === '' && !category) || category === cat.slug
                          ? 'text-obsidian font-medium'
                          : 'text-graphite hover:text-obsidian'
                      }`}
                    >
                      {cat.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium tracking-widest text-sm uppercase mb-4 text-graphite">Ordenar por</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link 
                    href={buildSortUrl('newest', category)}
                    className={`${sort === 'newest' ? 'text-obsidian font-medium' : 'text-graphite hover:text-obsidian'}`}
                  >
                    Mais Recentes
                  </Link>
                </li>
                <li>
                  <Link 
                    href={buildSortUrl('price_asc', category)}
                    className={`${sort === 'price_asc' ? 'text-obsidian font-medium' : 'text-graphite hover:text-obsidian'}`}
                  >
                    Preço: Menor para Maior
                  </Link>
                </li>
                <li>
                  <Link 
                    href={buildSortUrl('price_desc', category)}
                    className={`${sort === 'price_desc' ? 'text-obsidian font-medium' : 'text-graphite hover:text-obsidian'}`}
                  >
                    Preço: Maior para Menor
                  </Link>
                </li>
              </ul>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="mb-6 flex justify-between items-center text-sm text-graphite border-b border-graphite/10 pb-4">
              <span>{products.length} {products.length === 1 ? 'produto' : 'produtos'}</span>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} hoverScale="[1.75]" />
                ))}
              </div>
            ) : (
              <div className="py-24 text-center">
                <h3 className="text-xl font-serif mb-2">Nenhum produto encontrado</h3>
                <p className="text-graphite mb-6">Tente ajustar seus filtros de busca.</p>
                <Link href="/products" className="text-champagne border-b border-champagne pb-1">
                  Limpar todos os filtros
                </Link>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}