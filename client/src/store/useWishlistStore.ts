import { create } from 'zustand';
import { Product } from '../types';

interface WishlistState {
  items: Product[];
  toggleWishlist: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: JSON.parse(localStorage.getItem('vexo_wishlist') || '[]'),

  toggleWishlist: (product) => {
    const current = get().items;
    const exists = current.some((p) => p.id === product.id);

    let updated: Product[];
    if (exists) {
      updated = current.filter((p) => p.id !== product.id);
    } else {
      updated = [...current, product];
    }

    localStorage.setItem('vexo_wishlist', JSON.stringify(updated));
    set({ items: updated });
  },

  isWishlisted: (productId) => {
    return get().items.some((p) => p.id === productId);
  },
}));
