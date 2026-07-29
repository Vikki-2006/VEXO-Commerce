import { create } from 'zustand';
import { Product } from '../types';

interface CompareState {
  items: Product[];
  isOpen: boolean;
  toggleCompare: (product: Product) => void;
  isCompared: (productId: string) => boolean;
  clearCompare: () => void;
  openCompare: () => void;
  closeCompare: () => void;
}

export const useCompareStore = create<CompareState>((set, get) => ({
  items: [],
  isOpen: false,

  toggleCompare: (product) => {
    const current = get().items;
    const exists = current.some((p) => p.id === product.id);

    if (exists) {
      set({ items: current.filter((p) => p.id !== product.id) });
    } else {
      if (current.length >= 4) return; // Max 4 products for comparative analysis
      set({ items: [...current, product], isOpen: true });
    }
  },

  isCompared: (productId) => {
    return get().items.some((p) => p.id === productId);
  },

  clearCompare: () => set({ items: [] }),
  openCompare: () => set({ isOpen: true }),
  closeCompare: () => set({ isOpen: false }),
}));
