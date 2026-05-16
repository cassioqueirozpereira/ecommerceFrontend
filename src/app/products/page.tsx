import api from '@/lib/api';
import { Product } from '@/types';
import Link from 'next/link';

export const metadata = {
  title: 'Catálogo | Lumina',
  description: 'Explore todos os nossos produtos.',
};

async function getProducts() {
  try {
    const res = await api.get('/products');
    return res.data as Product[];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Nossa Coleção</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Descubra peças exclusivas desenhadas com atenção aos mínimos detalhes.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          Nenhum produto encontrado no momento.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Link href={`/products/${product.slug}`} key={product.id} className="group cursor-pointer block">
              <div className="relative aspect-[4/5] bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden mb-4">
                {product.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Sem Imagem
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-primary-500 transition-colors">
                  {product.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-2 line-clamp-1">
                  {product.description}
                </p>
                <div className="text-lg font-medium text-gray-900 dark:text-white">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.basePrice)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}