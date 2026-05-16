export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
}

export interface VariantAttribute {
  name: string;
  options: string[];
}

export interface Variant {
  id: string;
  sku: string;
  price: number;
  stockQuantity: number;
  attributes: VariantAttribute[];
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  basePrice: number;
  imageUrl: string;
  category: Category | null;
  variants: Variant[];
}

export interface User {
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  name: string;
  email: string;
  role: string;
}

export interface CartItem {
  variantId: string;
  productTitle: string;
  sku: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface OrderItem {
  id: string;
  productTitle: string;
  variantSku: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  subtotal: number;
  total: number;
  status: string;
  createdAt: string;
  paymentInitPoint: string | null;
  items: OrderItem[];
}