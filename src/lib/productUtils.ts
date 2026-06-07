/**
 * Shared URL builder utilities for product navigation.
 * Used by Header, products page, and any component that links to /products.
 */

export function buildCategoryUrl(newCat: string, sort?: string): string {
  const params = new URLSearchParams();
  if (newCat) params.append('category', newCat);
  if (sort) params.append('sort', sort);
  const qs = params.toString();
  return qs ? `/products?${qs}` : '/products';
}

export function buildSortUrl(newSort: string, category?: string, search?: string): string {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (search) params.append('search', search);
  params.append('sort', newSort);
  return `/products?${params.toString()}`;
}

/** Categories shown across nav and filter sidebar. Single source of truth. */
export const NAV_CATEGORIES = [
  { label: 'Novidades', slug: '' },
  { label: 'Perfumes', slug: 'perfume' },
  { label: 'Cuidados com a pele', slug: 'cuidados-com-a-pele' },
  { label: 'Kits e Presentes', slug: 'kits-e-presentes' },
] as const;

export const FILTER_CATEGORIES = [
  { label: 'Ver Tudo', slug: '' },
  { label: 'Perfume', slug: 'perfume' },
  { label: 'Cuidados com a pele', slug: 'cuidados-com-a-pele' },
  { label: 'Kits e Presentes', slug: 'kits-e-presentes' },
] as const;
