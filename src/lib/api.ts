import { Product } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export async function getProducts(category?: string, sort?: string): Promise<Product[]> {
  try {
    let url = `${API_BASE_URL}/products`;
    const params = new URLSearchParams();
    
    if (category) params.append('category', category);
    if (sort) params.append('sort', sort);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const res = await fetch(url, {
      next: { revalidate: 60, tags: ['products'] },
    });

    if (!res.ok) throw new Error('Failed to fetch products');
    
    return res.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    // In a real app we'd have a specific endpoint for this, e.g., /api/products/{slug}
    // For now we'll fetch all and find, or just mock it if backend isn't ready
    const res = await fetch(`${API_BASE_URL}/products`, {
      next: { revalidate: 60, tags: [`product-${slug}`] },
    });

    if (!res.ok) return null;
    
    const products: Product[] = await res.json();
    return products.find(p => p.slug === slug) || null;
  } catch (error) {
    console.error(`Error fetching product ${slug}:`, error);
    return null;
  }
}