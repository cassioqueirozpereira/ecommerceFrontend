import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { getProducts } from '@/lib/api';

// Forcing this page to revalidate every hour or rely on ISR
export const revalidate = 3600;

export default async function HomePage() {
  // Fetch featured products server-side
  const products = await getProducts();
  const featuredProducts = products.slice(0, 4);

  return (
    <>
      {/* Hero Section - Midnight Luxe Preset B */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-obsidian text-ivory">
        {/* Abstract dark luxury background placeholder */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/80 to-transparent z-10" />
          <img 
            src="/produto1.jpeg" 
            alt="Luxury abstract background" 
            className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
          />
        </div>
        
        <Container className="relative z-20 text-center flex flex-col items-center">
          <span className="text-champagne tracking-[0.2em] text-sm md:text-base font-medium mb-6 uppercase">
            A Nova Era da Beleza
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif tracking-tighter mb-6 max-w-4xl text-balance">
            Oceano noturno <br/>
            <span className="italic font-light">encontra a precisão.</span>
          </h1>
          <p className="text-ivory/70 text-lg md:text-xl max-w-xl mx-auto mb-10 font-light">
            Descubra nossa nova coleção de fragrâncias exclusivas desenhadas para deixar uma marca inesquecível.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/products?category=perfume" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full">
                Explorar Fragrâncias
              </Button>
            </Link>
            <Link href="/products" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full border-ivory/30 text-ivory hover:bg-ivory/10">
                Ver Tudo
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Featured Products Section */}
      <section className="py-24 bg-ivory text-obsidian">
        <Container>
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif tracking-tight">Destaques</h2>
              <p className="text-graphite mt-2">Nossas curadorias mais exclusivas.</p>
            </div>
            <Link href="/products" className="hidden md:inline-flex text-sm font-medium hover:text-champagne transition-colors pb-1 border-b border-obsidian hover:border-champagne">
              Ver Coleção Completa
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <Link key={product.id} href={`/product/${product.slug}`} className="group flex flex-col">
                  <div className="aspect-[4/5] bg-graphite/5 rounded-md overflow-hidden mb-4 relative">
                    {product.images?.[0] ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-graphite/30">
                        No Image
                      </div>
                    )}
                    <div className="absolute inset-0 bg-obsidian/0 group-hover:bg-obsidian/5 transition-colors duration-300" />
                  </div>
                  <h3 className="font-medium text-lg leading-tight group-hover:text-champagne transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-graphite mt-1">{product.category?.name || 'Skincare'}</p>
                  <p className="font-serif mt-2">${product.basePrice.toFixed(2)}</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/5] bg-graphite/10 rounded-md mb-4" />
                  <div className="h-5 bg-graphite/10 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-graphite/10 rounded w-1/2" />
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-12 text-center md:hidden">
            <Link href="/products">
              <Button variant="outline" size="full">Ver Coleção Completa</Button>
            </Link>
          </div>
        </Container>
      </section>
      
      {/* Editorial/Bento Grid Section for Conversions */}
      <section className="py-24 bg-graphite text-ivory">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-auto md:h-[600px]">
            <Link href="/products?category=perfume" className="group relative rounded-lg overflow-hidden h-[400px] md:h-auto">
              <img 
                src="/produto2.jpeg" 
                alt="Perfumes" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 md:p-12">
                <h3 className="font-serif text-3xl mb-2">Essência</h3>
                <p className="text-ivory/70 mb-4 max-w-sm">Perfumes que redefinem a sofisticação moderna.</p>
                <span className="inline-block border-b border-champagne text-champagne pb-1">Comprar Perfumes</span>
              </div>
            </Link>
            <div className="grid grid-rows-2 gap-4">
              <Link href="/products?category=skincare" className="group relative rounded-lg overflow-hidden h-[300px] md:h-auto">
                <img 
                  src="/produto3.jpeg" 
                  alt="Skincare" 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8">
                  <h3 className="font-serif text-2xl mb-2">Rituais</h3>
                  <span className="inline-block border-b border-champagne text-champagne pb-1">Skincare</span>
                </div>
              </Link>
              <Link href="/products?category=gifts" className="group relative rounded-lg overflow-hidden h-[300px] md:h-auto bg-obsidian flex items-center justify-center">
                <div className="text-center p-8 z-10">
                  <h3 className="font-serif text-3xl italic mb-4">A Arte de Presentear</h3>
                  <Button variant="outline" className="border-champagne text-champagne hover:bg-champagne hover:text-obsidian">
                    Descobrir Kits
                  </Button>
                </div>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}