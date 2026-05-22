import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { getProducts } from '@/lib/api';

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

  // Sorting links helper
  const buildSortUrl = (newSort: string) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    params.append('sort', newSort);
    return `/products?${params.toString()}`;
  };

  const buildCategoryUrl = (newCat: string) => {
    const params = new URLSearchParams();
    if (newCat) params.append('category', newCat);
    if (sort) params.append('sort', sort);
    return `/products?${params.toString()}`;
  };

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
                <li>
                  <Link 
                    href={buildCategoryUrl('')}
                    className={`${!category ? 'text-obsidian font-medium' : 'text-graphite hover:text-obsidian'}`}
                  >
                    Ver Tudo
                  </Link>
                </li>
                <li>
                  <Link 
                    href={buildCategoryUrl('perfume')}
                    className={`${category === 'perfume' ? 'text-obsidian font-medium' : 'text-graphite hover:text-obsidian'}`}
                  >
                    Perfume
                  </Link>
                </li>
                <li>
                  <Link 
                    href={buildCategoryUrl('skincare')}
                    className={`${category === 'skincare' ? 'text-obsidian font-medium' : 'text-graphite hover:text-obsidian'}`}
                  >
                    Skincare
                  </Link>
                </li>
                <li>
                  <Link 
                    href={buildCategoryUrl('gifts')}
                    className={`${category === 'gifts' ? 'text-obsidian font-medium' : 'text-graphite hover:text-obsidian'}`}
                  >
                    Kits e Presentes
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium tracking-widest text-sm uppercase mb-4 text-graphite">Ordenar por</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link 
                    href={buildSortUrl('newest')}
                    className={`${sort === 'newest' ? 'text-obsidian font-medium' : 'text-graphite hover:text-obsidian'}`}
                  >
                    Mais Recentes
                  </Link>
                </li>
                <li>
                  <Link 
                    href={buildSortUrl('price_asc')}
                    className={`${sort === 'price_asc' ? 'text-obsidian font-medium' : 'text-graphite hover:text-obsidian'}`}
                  >
                    Preço: Menor para Maior
                  </Link>
                </li>
                <li>
                  <Link 
                    href={buildSortUrl('price_desc')}
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
                  <Link key={product.id} href={`/product/${product.slug}`} className="group flex flex-col">
                    <div className="aspect-[4/5] bg-graphite/5 rounded-md overflow-hidden mb-4 relative">
                      {product.images?.[0] ? (
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.75]"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-graphite/30 bg-graphite/5">
                          No Image
                        </div>
                      )}
                      <div className="absolute inset-0 bg-obsidian/0 group-hover:bg-obsidian/5 transition-colors duration-300" />
                    </div>
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-medium text-lg leading-tight group-hover:text-champagne transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-sm text-graphite mt-1">{product.category?.name || 'Skincare'}</p>
                      </div>
                      <p className="font-serif">${product.basePrice.toFixed(2)}</p>
                    </div>
                  </Link>
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