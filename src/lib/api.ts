import { Product } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export async function getProducts(category?: string, sort?: string): Promise<Product[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout to prevent build hangs

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
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error('Failed to fetch products');
    
    return res.json();
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

  try {
    const res = await fetch(`${API_BASE_URL}/products`, {
      next: { revalidate: 60, tags: [`product-${slug}`] },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!res.ok) return null;
    
    const products: Product[] = await res.json();
    return products.find(p => p.slug === slug) || null;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error(`Error fetching product ${slug}:`, error);
    return null;
  }
}

export async function loginUser(data: any) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Falha ao fazer login');
  }

  return res.json();
}

export async function registerUser(data: any) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Falha ao registrar');
  }

  return res.json();
}

export async function subscribeNewsletter(email: string) {
  const res = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Falha ao inscrever newsletter');
  }

  return res.json();
}

export async function createProduct(data: unknown, token: string) {
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error('Erro detalhado do servidor (createProduct):', errorData);
    const errorMessage = errorData.detail || errorData.title || errorData.message || 'Falha ao criar produto';
    throw new Error(errorMessage);
  }

  return res.json();
}

export async function getCloudinarySignature(token: string, folder: string = 'ecommerce/products') {
  const res = await fetch(`${API_BASE_URL}/upload/signature?folder=${encodeURIComponent(folder)}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Falha ao obter assinatura de upload');
  }

  return res.json();
}