import { create } from 'zustand';
import { Product, CartItem } from '../types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  couponCode: string | null;
  discountAmount: number;
  shippingThreshold: number;
  addItem: (product: Product, quantity?: number, color?: string, size?: string) => void;
  removeItem: (productId: string, color?: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, color?: string, size?: string) => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  getSubtotal: () => number;
  getShippingFee: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: JSON.parse(localStorage.getItem('vexo_cart') || '[]'),
  isOpen: false,
  couponCode: null,
  discountAmount: 0,
  shippingThreshold: 15000,

  addItem: (product, quantity = 1, color, size) => {
    const current = get().items;
    const existingIndex = current.findIndex(
      (item) => item.product.id === product.id && item.color === color && item.size === size
    );

    let updated: CartItem[];
    if (existingIndex > -1) {
      updated = current.map((item, idx) =>
        idx === existingIndex ? { ...item, quantity: item.quantity + quantity } : item
      );
    } else {
      updated = [...current, { product, quantity, color, size }];
    }

    localStorage.setItem('vexo_cart', JSON.stringify(updated));
    set({ items: updated, isOpen: true });
  },

  removeItem: (productId, color, size) => {
    const updated = get().items.filter(
      (item) => !(item.product.id === productId && item.color === color && item.size === size)
    );
    localStorage.setItem('vexo_cart', JSON.stringify(updated));
    set({ items: updated });
  },

  updateQuantity: (productId, quantity, color, size) => {
    if (quantity <= 0) {
      get().removeItem(productId, color, size);
      return;
    }
    const updated = get().items.map((item) =>
      item.product.id === productId && item.color === color && item.size === size
        ? { ...item, quantity }
        : item
    );
    localStorage.setItem('vexo_cart', JSON.stringify(updated));
    set({ items: updated });
  },

  applyCoupon: (code, discount) => {
    set({ couponCode: code, discountAmount: discount });
  },

  removeCoupon: () => {
    set({ couponCode: null, discountAmount: 0 });
  },

  clearCart: () => {
    localStorage.removeItem('vexo_cart');
    set({ items: [], couponCode: null, discountAmount: 0 });
  },

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

  getSubtotal: () => {
    return get().items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  },

  getShippingFee: () => {
    const subtotal = get().getSubtotal();
    if (subtotal === 0) return 0;
    return subtotal >= get().shippingThreshold ? 0 : 1500;
  },

  getTotal: () => {
    const subtotal = get().getSubtotal();
    const shipping = get().getShippingFee();
    const discount = get().discountAmount;
    return Math.max(0, subtotal - discount + shipping);
  },

  getItemCount: () => {
    return get().items.reduce((acc, item) => acc + item.quantity, 0);
  },
}));
