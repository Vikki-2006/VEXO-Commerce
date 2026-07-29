import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  Grid3X3,
  LayoutGrid,
  List,
  X,
  RefreshCw,
} from 'lucide-react';
import { api } from '../services/api';
import { Product, Category, FilterState } from '../types';
import { ProductCard } from '../components/product/ProductCard';
import { QuickViewModal } from '../components/product/QuickViewModal';
import { MinimalInput } from '../components/ui/MinimalInput';
import { Badge } from '../components/ui/Badge';

import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { SEO } from '../components/common/SEO';
import { formatCurrency } from '../utils/formatters';


export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<'grid-3' | 'grid-4' | 'list'>('grid-4');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [priceRange, setPriceRange] = useState<number>(Number(searchParams.get('maxPrice')) || 2000);
  const [minRating, setMinRating] = useState<number>(Number(searchParams.get('rating')) || 0);
  const [sort, setSort] = useState<FilterState['sort']>(
    (searchParams.get('sort') as FilterState['sort']) || 'featured'
  );

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const catData = await api.getCategories();
        setCategories(catData);
      } catch (e) {
        console.error(e);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const filters: Partial<FilterState> = {
          search,
          category: selectedCategory,
          maxPrice: priceRange,
          rating: minRating,
          sort,
        };
        const res = await api.getProducts(filters);
        setProducts(res.products);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchProducts, 200);
    return () => clearTimeout(timer);
  }, [search, selectedCategory, priceRange, minRating, sort]);

  const clearAllFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setPriceRange(2000);
    setMinRating(0);
    setSort('featured');
    setSearchParams({});
  };

  const hasActiveFilters = search || selectedCategory || priceRange < 2000 || minRating > 0;

  return (
    <div className="pt-28 pb-20 max-w-[1700px] 3xl:max-w-[2000px] mx-auto px-4 sm:px-8 lg:px-12 min-h-screen text-ink theme-transition">
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* Catalogue Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-sand pb-6">
        <div>
          <span className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] block mb-1">
            VEXO CATALOGUE INDEX
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-ink tracking-tight font-serif">
            Hardware Systems & Accessories
          </h1>
          <p className="text-xs text-stone mt-1 font-semibold">
            Showing <strong className="text-ink">{products.length}</strong> precision items
          </p>
        </div>

        {/* View Switcher & Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
            className="md:hidden flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-sand text-xs font-bold text-ink"
          >
            <SlidersHorizontal className="w-4 h-4 text-gold" /> Filter Index
          </button>

          <div className="hidden sm:flex items-center gap-1 bg-card border border-sand rounded-lg p-1 shadow-subtle">
            <button
              onClick={() => setViewMode('grid-3')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'grid-3' ? 'bg-ink text-ivory' : 'text-stone hover:text-ink'
              }`}
              title="3-Column Grid"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid-4')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'grid-4' ? 'bg-ink text-ivory' : 'text-stone hover:text-ink'
              }`}
              title="4-Column Grid"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'list' ? 'bg-ink text-ivory' : 'text-stone hover:text-ink'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as FilterState['sort'])}
            className="minimal-input px-4 py-2 rounded-lg text-xs font-bold text-ink bg-card border-sand focus:outline-none"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest Releases</option>
          </select>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-6 p-3 rounded-xl bg-warm border border-sand">
          <span className="text-xs font-bold text-stone uppercase tracking-wider mr-2">Active Filters:</span>
          {search && (
            <Badge variant="gold" className="flex items-center gap-1">
              "{search}" <X className="w-3 h-3 cursor-pointer" onClick={() => setSearch('')} />
            </Badge>
          )}
          {selectedCategory && (
            <Badge variant="gold" className="flex items-center gap-1">
              Cat: {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('')} />
            </Badge>
          )}
          {priceRange < 2000 && (
            <Badge variant="gold" className="flex items-center gap-1">
              Under {formatCurrency(priceRange)}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setPriceRange(2000)} />
            </Badge>
          )}
          {minRating > 0 && (
            <Badge variant="gold" className="flex items-center gap-1">
              {minRating}+ Stars
              <X className="w-3 h-3 cursor-pointer" onClick={() => setMinRating(0)} />
            </Badge>
          )}
          <button
            onClick={clearAllFilters}
            className="text-xs font-bold text-danger hover:underline ml-auto flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Clear All
          </button>
        </div>
      )}

      <SEO
        title="Catalogue Index | VEXO Systems"
        description="Explore the full catalog of VEXO acoustic systems, 4K QD-OLED master displays, and milled keydecks."
      />
      
      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Filter Sidebar */}
        <aside
          className={`lg:col-span-3 xl:col-span-2 studio-card rounded-xl p-6 border border-sand bg-card space-y-6 ${
            filterDrawerOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="flex items-center justify-between border-b border-sand pb-4">
            <h3 className="text-xs font-black text-ink uppercase tracking-wider flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-gold" /> Filter Index
            </h3>
            {hasActiveFilters && (
              <button onClick={clearAllFilters} className="text-[11px] text-stone hover:text-ink font-bold">
                Reset
              </button>
            )}
          </div>

          {/* Search Field */}
          <div>
            <MinimalInput
              label="Search Device"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          {/* Categories */}
          <div>
            <label className="text-[10px] font-extrabold text-stone uppercase tracking-wider block mb-2">
              Category
            </label>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-between ${
                  selectedCategory === '' ? 'bg-warm text-ink border border-sand' : 'text-stone hover:text-ink'
                }`}
              >
                <span>All Categories</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-between ${
                    selectedCategory === cat.slug
                      ? 'bg-warm text-ink border border-sand'
                      : 'text-stone hover:text-ink'
                  }`}
                >
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-[10px] font-extrabold text-stone uppercase tracking-wider">
                Max Price
              </label>
              <span className="text-xs font-black text-gold">{formatCurrency(priceRange)}</span>
            </div>
            <input
              type="range"
              min="50"
              max="2000"
              step="25"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-gold cursor-pointer"
            />
          </div>

          {/* Minimum Rating */}
          <div>
            <label className="text-[10px] font-extrabold text-stone uppercase tracking-wider block mb-2">
              Minimum Rating
            </label>
            <div className="flex gap-2">
              {[0, 4, 4.5, 4.8].map((rat) => (
                <button
                  key={rat}
                  onClick={() => setMinRating(rat)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center justify-center gap-1 ${
                    minRating === rat
                      ? 'bg-ink text-ivory border-ink'
                      : 'bg-warm text-stone border-sand hover:text-ink'
                  }`}
                >
                  {rat === 0 ? 'All' : `${rat}★`}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Catalog Grid */}
        <main className="lg:col-span-9 xl:col-span-10">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="studio-card rounded-xl p-4 space-y-4 bg-card">
                  <Skeleton className="aspect-square w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              type="search"
              title="No products found"
              subtitle="No items matched your filter criteria. Try clearing search filters."
              actionText="Clear Filters"
              onAction={clearAllFilters}
            />
          ) : (
            <div
              className={`grid gap-6 ${
                viewMode === 'grid-4'
                  ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5'
                  : viewMode === 'list'
                  ? 'grid-cols-1'
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              }`}
            >
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
