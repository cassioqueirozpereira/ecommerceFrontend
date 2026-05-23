import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { ProductCard } from '@/components/ui/ProductCard';
import { getProducts } from '@/lib/api';

export const metadata = {
  title: 'Coleção | Luxe Beauty',
  description: 'Explore nossa coleção premium de produtos de beleza e perfumaria.',
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; sort?: string; search?: string; q?: string };
}) {
  const { category, sort, search, q } = searchParams;
  const searchQuery = search || q;
  
  // Fetch from server using SSR with query params
  const products = await getProducts(category, sort, searchQuery);

  return (
    <div className="min-h-screen bg-ivory text-obsidian pb-24">
      {/* Category Header */}
      <div className="bg-obsidian text-ivory py-16 md:py-24 text-center">
        <Container>
          <h1 className="text-4xl md:text-6xl font-serif tracking-tighter mb-4 capitalize">
            {searchQuery ? `Busca: ${searchQuery}` : (category || 'Toda a Coleção')}
          </h1>
          <p className="text-ivory/70 max-w-2xl mx-auto font-light">
            {searchQuery 
              ? `Mostrando resultados encontrados para a pesquisa "${searchQuery}".`
              : 'Descubra o auge da qualidade e sofisticação. Nossa seleção curada representa a melhor perfumaria e cuidados para a pele.'}
          </p>
        </Container>
      </div>

      <Container className="mt-12">
        <div className="flex flex-col md:flex-row gap-8">


          {/* Product Grid */}
          <div className="flex-1">
            <div className="mb-6 flex justify-between items-center text-sm text-graphite border-b border-graphite/10 pb-4">
              <span>{products.length} {products.length === 1 ? 'produto' : 'produtos'}</span>
              {searchQuery && (
                <Link href="/products" className="text-champagne hover:text-champagne/80 font-medium transition-colors">
                  Ver todos os produtos
                </Link>
              )}
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-24 text-center">
                <h3 className="text-xl font-serif mb-2">Nenhum produto encontrado</h3>
                <p className="text-graphite mb-6">Tente ajustar seus filtros de busca ou termos pesquisados.</p>
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