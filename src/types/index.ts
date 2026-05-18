export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
}

export interface Variant {
  id: string;
  sku: string;
  name: string;
  price: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  promotionalPrice?: number;
  images: string[];
  category: Category;
  variants: Variant[];
}

export interface CartItem {
  product: Product;
  variant: Variant;
  quantity: number;
}