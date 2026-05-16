import api from '@/lib/api';
import { Product } from '@/types';
import AddToCartButton from './AddToCartButton';

async function getProduct(slug: string) {
  try {
    const res = await api.get(`/products/${slug}`);
    return res.data as Product;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  return {
    title: product ? `${product.title} | Lumina` : 'Produto não encontrado',
  };
}

export default async function ProductDetailsPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Produto não encontrado</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-3xl overflow-hidden aspect-[4/5] relative">
          {product.imageUrl ? (
             <img 
               src={product.imageUrl} 
               alt={product.title}
               className="w-full h-full object-cover"
             />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Sem Imagem
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center">
          {product.category && (
            <div className="text-sm text-primary-500 font-medium mb-2 uppercase tracking-wider">
              {product.category.name}
            </div>
          )}
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">{product.title}</h1>
          <div className="text-3xl font-light text-gray-800 dark:text-gray-200 mb-6">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.basePrice)}
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            {product.description}
          </p>

          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}