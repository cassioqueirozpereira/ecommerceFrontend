import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, Variant } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, variant: Variant, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  getCartTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      setIsOpen: (isOpen) => set({ isOpen }),
      
      addItem: (product, variant, quantity = 1) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.variant.id === variant.id
          );

          if (existingItemIndex >= 0) {
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += quantity;
            return { items: newItems, isOpen: true };
          }

          return { 
            items: [...state.items, { product, variant, quantity }],
            isOpen: true 
          };
        });
      },
      
      removeItem: (variantId) => {
        set((state) => ({
          items: state.items.filter((item) => item.variant.id !== variantId),
        }));
      },
      
      updateQuantity: (variantId, quantity) => {
        set((state) => ({
          items: state.items.map((item) => 
            item.variant.id === variantId ? { ...item, quantity } : item
          ),
        }));
      },
      
      clearCart: () => set({ items: [] }),
      
      getCartTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (item.variant.price * item.quantity), 0);
      }
    }),
    {
      name: 'luxe-cart-storage',
      // We only persist the items, not the 'isOpen' state
      partialize: (state) => ({ items: state.items }),
    }
  )
);
