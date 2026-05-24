import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, Variant } from '@/types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  addItem: (product: Product, variant: Variant, quantity?: number) => { success: boolean; message?: string };
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      setIsOpen: (isOpen) => set({ isOpen }),

      addItem: (product, variant, quantity = 1) => {
        const state = get();
        const existingItem = state.items.find((item) => item.variant.id === variant.id);
        const currentQty = existingItem?.quantity ?? 0;
        const newQty = currentQty + quantity;

        if (variant.stock <= 0) {
          return { success: false, message: 'Produto esgotado.' };
        }

        if (newQty > variant.stock) {
          if (existingItem) set({ isOpen: true });
          return {
            success: false,
            message: `Estoque insuficiente. Máximo disponível: ${variant.stock} unidade(s).`,
          };
        }

        set((state) => {
          const existingIndex = state.items.findIndex((item) => item.variant.id === variant.id);
          if (existingIndex >= 0) {
            const newItems = [...state.items];
            newItems[existingIndex] = { ...newItems[existingIndex], quantity: newQty };
            return { items: newItems, isOpen: true };
          }
          return {
            items: [...state.items, { product, variant, quantity }],
            isOpen: true,
          };
        });

        return { success: true };
      },

      removeItem: (variantId) => {
        set((state) => ({
          items: state.items.filter((item) => item.variant.id !== variantId),
        }));
      },

      updateQuantity: (variantId, quantity) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.variant.id !== variantId) return item;
            const clamped = Math.min(Math.max(1, quantity), item.variant.stock);
            return { ...item, quantity: clamped };
          }),
        }));
      },

      clearCart: () => set({ items: [] }),

      getCartTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.variant.price * item.quantity, 0);
      },
    }),
    {
      name: 'luxe-cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
