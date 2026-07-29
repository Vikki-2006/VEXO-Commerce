import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, SlidersHorizontal, User, ShieldCheck, ArrowRight, X, Clock, Trash2 } from 'lucide-react';
import { useCommandPaletteStore } from '../../store/useCommandPaletteStore';
import { useRecentSearchesStore } from '../../store/useRecentSearchesStore';

import { api } from '../../services/api';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/formatters';

export const CommandPalette: React.FC = () => {
  const navigate = useNavigate();
  const { isOpen, close, toggle } = useCommandPaletteStore();
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { searches: recentSearches, addSearch: saveRecentSearch, clearSearches: clearRecentSearches } = useRecentSearchesStore();


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggle();
      }
      if (e.key === 'Escape' && isOpen) {
        close();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, close, toggle]);

  useEffect(() => {
    if (!query.trim()) {
      setProducts([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.getProducts({ search: query });
        setProducts(res.products);
        setSelectedIndex(0);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const quickActions = [
    { title: 'Explore Full Index', path: '/shop', icon: <ShoppingBag className="w-4 h-4 text-ink" /> },
    { title: 'Compare Hardware Specs', path: '/compare', icon: <SlidersHorizontal className="w-4 h-4 text-gold" /> },
    { title: 'User Account & Orders', path: '/account', icon: <User className="w-4 h-4 text-stone" /> },
    { title: 'Admin Command Center', path: '/admin', icon: <ShieldCheck className="w-4 h-4 text-titanium" /> },
  ];

  const handleSelectProduct = (product: Product) => {
    saveRecentSearch(query || product.title);
    close();
    navigate(`/product/${product.slug}`);
  };

  const handleKeyDownInBox = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (products.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + (products.length || 1)) % (products.length || 1));
    } else if (e.key === 'Enter' && products[selectedIndex]) {
      e.preventDefault();
      handleSelectProduct(products[selectedIndex]);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Command Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -10 }}
          onKeyDown={handleKeyDownInBox}
          className="relative w-full max-w-2xl bg-card rounded-2xl p-4 shadow-modal border border-sand z-10 overflow-hidden text-ink theme-transition"
        >
          {/* Input Header */}
          <div className="flex items-center gap-3 px-3 py-2 border-b border-sand">
            <Search className="w-4 h-4 text-stone shrink-0" />
            <input
              autoFocus
              type="text"
              placeholder="Search VEXO devices, acoustics, or commands..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-sm font-bold text-ink placeholder:text-stone/60 focus:outline-none"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-stone hover:text-ink">
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono bg-warm rounded border border-sand text-stone">
              ESC
            </kbd>
          </div>

          {/* Body Content */}
          <div className="py-3 px-1 max-h-[60vh] overflow-y-auto space-y-4">
            {/* Query Results */}
            {query.trim() !== '' && (
              <div>
                <h4 className="text-[10px] font-bold text-stone uppercase tracking-wider px-3 mb-2">
                  Matching Index ({products.length})
                </h4>
                {loading ? (
                  <div className="p-4 text-center text-xs text-stone font-semibold">Searching catalogue...</div>
                ) : products.length > 0 ? (
                  <div className="space-y-1">
                    {products.map((p, idx) => (
                      <div
                        key={p.id}
                        onClick={() => handleSelectProduct(p)}
                        className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors group ${
                          selectedIndex === idx ? 'bg-warm border border-sand' : 'hover:bg-warm/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0]}
                            alt={p.title}
                            className="w-10 h-10 rounded-lg object-cover border border-sand"
                          />
                          <div>
                            <h5 className="text-xs font-bold text-ink group-hover:text-gold transition-colors">
                              {p.title}
                            </h5>
                            <p className="text-[11px] text-stone line-clamp-1">{p.subtitle}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-extrabold text-ink">{formatCurrency(p.price)}</span>
                          <ArrowRight className="w-4 h-4 text-stone group-hover:text-ink transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-xs text-stone font-semibold">
                    <Search className="w-8 h-8 text-stone/40 mx-auto mb-2" />
                    No hardware found for "{query}".
                  </div>
                )}
              </div>
            )}

            {/* Recent Searches */}
            {query.trim() === '' && recentSearches.length > 0 && (
              <div>
                <div className="flex items-center justify-between px-3 mb-2">
                  <h4 className="text-[10px] font-bold text-stone uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-gold" /> Recent Searches
                  </h4>
                  <button onClick={clearRecentSearches} className="text-[10px] text-stone hover:text-danger font-bold flex items-center gap-1">
                    <Trash2 className="w-3 h-3" /> Clear
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 px-3 mb-4">
                  {recentSearches.map((term, i) => (
                    <button
                      key={i}
                      onClick={() => setQuery(term)}
                      className="px-3 py-1 rounded-full bg-warm border border-sand text-xs font-semibold text-stone hover:text-ink hover:border-ink transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            {query.trim() === '' && (
              <div>
                <h4 className="text-[10px] font-bold text-stone uppercase tracking-wider px-3 mb-2">
                  Quick Actions
                </h4>
                <div className="space-y-1">
                  {quickActions.map((action) => (
                    <div
                      key={action.path}
                      onClick={() => {
                        close();
                        navigate(action.path);
                      }}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-warm cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-warm border border-sand">
                          {action.icon}
                        </div>
                        <span className="text-xs font-bold text-ink group-hover:text-gold transition-colors">
                          {action.title}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-stone group-hover:text-ink transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
