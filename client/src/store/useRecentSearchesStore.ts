import { create } from 'zustand';

interface RecentSearchesState {
  searches: string[];
  addSearch: (query: string) => void;
  removeSearch: (query: string) => void;
  clearSearches: () => void;
}

export const useRecentSearchesStore = create<RecentSearchesState>((set, get) => ({
  searches: JSON.parse(localStorage.getItem('vexo_recent_searches') || '[]'),

  addSearch: (query) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    const current = get().searches;
    const filtered = current.filter((s) => s.toLowerCase() !== trimmed.toLowerCase());
    const updated = [trimmed, ...filtered].slice(0, 8);

    localStorage.setItem('vexo_recent_searches', JSON.stringify(updated));
    set({ searches: updated });
  },

  removeSearch: (query) => {
    const updated = get().searches.filter((s) => s !== query);
    localStorage.setItem('vexo_recent_searches', JSON.stringify(updated));
    set({ searches: updated });
  },

  clearSearches: () => {
    localStorage.removeItem('vexo_recent_searches');
    set({ searches: [] });
  },
}));
