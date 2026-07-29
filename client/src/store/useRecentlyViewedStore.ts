import { create } from 'zustand';
import { Product } from '../types';

interface RecentlyViewedState {
  items: Product[];
  addRecentlyViewed: (product: Product) => void;
  clearRecentlyViewed: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>((set, get) => ({
  items: JSON.parse(localStorage.getItem('vexo_recently_viewed') || '[]'),

  addRecentlyViewed: (product) => {
    const current = get().items;
    const filtered = current.filter((p) => p.id !== product.id);
    const updated = [product, ...filtered].slice(0, 6);

    localStorage.setItem('vexo_recently_viewed', JSON.stringify(updated));
    set({ items: updated });
  },

  clearRecentlyViewed: () => {
    localStorage.removeItem('vexo_recently_viewed');
    set({ items: [] });
  },
}));
