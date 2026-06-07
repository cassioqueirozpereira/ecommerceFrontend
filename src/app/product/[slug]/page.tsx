import React from 'react';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { getProductBySlug } from '@/lib/api';
import { AddToCartClient } from '@/components/product/AddToCartClient';
import { Metadata } from 'next';

interface Props {
  params: { slug: string };
}

// Generate Dynamic Metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  
  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: `${product.name} | VS BEAUTY`,
    description: product.description.substring(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.substring(0, 160),
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  // Generate JSON-LD for rich snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images?.[0] || '',
    sku: product.variants?.[0]?.sku || '',
    offers: {
      '@type': 'Offer',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/product/${product.slug}`,
      priceCurrency: 'USD',
      price: product.basePrice,
      availability: product.variants?.some(v => v.stock > 0) 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-ivory text-obsidian py-12 md:py-24">
        <Container>
          <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
            
            {/* 1. Imagem (Mobile first) */}
            <div className="w-full md:w-1/2 flex-shrink-0">
              <div className="aspect-[4/5] bg-graphite/5 rounded-lg overflow-hidden sticky top-32">
                {product.images?.[0] ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-graphite/30">
                    No Image
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="w-full md:w-1/2 flex flex-col pt-4 md:pt-12">
              
              {/* Category Breadcrumb */}
              <nav className="text-sm text-graphite mb-4 uppercase tracking-widest">
                <a href="/products" className="hover:text-obsidian transition-colors">Coleção</a>
                <span className="mx-2">/</span>
                <a href={`/products?category=${product.category?.slug}`} className="hover:text-obsidian transition-colors">
                  {product.category?.name || 'Geral'}
                </a>
              </nav>

              {/* 2. Nome */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif tracking-tighter mb-8 leading-tight">
                {product.name}
              </h1>

              {/* 3, 4, 5, 6: Preço, Parcelamento, CTA, Variantes (Client Component) */}
              <div className="mb-12">
                <AddToCartClient product={product} />
              </div>

              {/* 7. Descrição */}
              <div className="prose prose-obsidian max-w-none pt-12 border-t border-graphite/10">
                <h3 className="text-sm font-medium uppercase tracking-widest mb-6 text-graphite">
                  Detalhes do Produto
                </h3>
                <p className="text-base leading-relaxed text-obsidian/80">
                  {product.description}
                </p>
              </div>

            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
